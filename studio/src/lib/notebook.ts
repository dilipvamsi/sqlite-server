import localforage from 'localforage';
import { toJson, type JsonValue } from "@bufbuild/protobuf";
import { ValueSchema } from "@bufbuild/protobuf/wkt";

export interface NotebookCard {
    id: string;
    sql: string;
    params: string;
    // Result is now optional and may be loaded lazily
    result?: {
        columns?: string[];
        rows?: any[];
        rowsAffected?: string;
        lastInsertId?: string;
    };
    error?: string;
    executionTimeMs?: string;
    status: 'idle' | 'running' | 'success' | 'error';
    readOnly?: boolean; // New: To lock successful transaction steps
}

export type RunQueryCallback = (sql: string, params: string) => Promise<any>;

// Use a generic store name, we will manage keys physically with prefixes
const STORE_NAME = 'sqlite-studio-data';

export class NotebookManager {
    private store: LocalForage;
    private dbName: string;
    private pageType: 'query' | 'transaction';
    private cardContainer: HTMLElement;
    private resultContainer: HTMLElement;
    private runCallback: RunQueryCallback;

    private cards: NotebookCard[] = [];
    private selectedCardId: string | null = null;
    private readOnly: boolean = false;

    // Dynamic prefix for storage keys
    private storagePrefix: string;

    constructor(
        dbName: string,
        pageType: 'query' | 'transaction',
        cardContainer: HTMLElement,
        resultContainer: HTMLElement,
        runCallback: RunQueryCallback
    ) {
        this.dbName = dbName;
        this.pageType = pageType;
        this.cardContainer = cardContainer;
        this.resultContainer = resultContainer;
        this.runCallback = runCallback;

        this.store = localforage.createInstance({
            name: 'sqlite-studio',
            storeName: STORE_NAME
        });

        // Default Prefix
        if (this.pageType === 'query') {
            this.storagePrefix = `${this.dbName}/query/`;
        } else {
            // For transaction, we start with a default or 'draft' scope until a Tx starts
            this.storagePrefix = `${this.dbName}/transaction/draft/query/`;
        }

        this.init();
    }

    public setReadOnly(ro: boolean) {
        this.readOnly = ro;
        this.renderCards();
        this.renderResultPanel();
    }

    // Allows changing the storage scope (e.g. when a new Transaction ID is generated)
    public async setTransactionContext(txId: string | null) {
        if (this.pageType !== 'transaction') return;

        if (txId) {
            this.storagePrefix = `${this.dbName}/transaction/${txId}/query/`;
            // Start fresh for new transaction if not loading history (history load handles loading cards)
            // But here we rely on loadCards() being called or manually resetting.
            // If we are switching context, we should reload cards from that context.
            await this.loadCards();
        } else {
            this.storagePrefix = `${this.dbName}/transaction/draft/query/`;
            await this.loadCards();
        }
    }

    private async init() {
        try {
            await this.loadCards();
        } catch (e) {
            console.error('Failed to load notebook', e);
            this.addCard(false);
        }

        // Global Event Delegation (Card List)
        this.cardContainer.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const cardEl = target.closest('.notebook-card') as HTMLElement;
            if (!cardEl) return;
            const cardId = cardEl.dataset.id!;

            // Only select if not clicking remove (avoids jumps)
            if (!target.closest('.remove-btn')) {
                this.selectCard(cardId);
            }

            if (target.closest('.run-btn')) {
                this.handleRun(cardId);
            } else if (target.closest('.remove-btn')) {
                this.removeCard(cardId);
            }
        });

        // Auto-save & inputs
        this.cardContainer.addEventListener('input', (e) => {
            if (this.readOnly) return;

            const target = e.target as HTMLElement;
            const cardEl = target.closest('.notebook-card') as HTMLElement;
            if (!cardEl) return;
            const cardId = cardEl.dataset.id!;

            const card = this.cards.find(c => c.id === cardId);
            if (!card) return;
            if (card.readOnly) return; // Individual card lock

            if (target.matches('.sql-editor')) {
                card.sql = (target as HTMLTextAreaElement).value;
                this.saveCardMetadata(card);
            } else if (target.matches('.params-editor')) {
                card.params = (target as HTMLTextAreaElement).value;
                this.saveCardMetadata(card);
            }
        });

        // Ctrl+Enter
        this.cardContainer.addEventListener('keydown', (e) => {
            if (this.readOnly) return;

            const target = e.target as HTMLElement;
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const cardEl = target.closest('.notebook-card') as HTMLElement;
                if (cardEl) {
                    this.handleRun(cardEl.dataset.id!);
                }
            }
        });
    }

    private async loadCards() {
        // 1. Load Order
        const orderKey = this.storagePrefix + '_order';
        const order = await this.store.getItem<string[]>(orderKey);

        if (order && Array.isArray(order) && order.length > 0) {
            // 2. Load Metadata (Parallel)
            const promises = order.map(id => this.store.getItem<NotebookCard>(this.storagePrefix + id));
            const results = await Promise.all(promises);

            this.cards = results.filter(c => c !== null) as NotebookCard[];

            // If data corruption (order exists but cards don't), fallback
            if (this.cards.length === 0) {
                // If context is specific Tx ID (not draft), maybe it's empty history? 
                // Don't auto-add card for historical tx, only for new/draft or empty query console
                if (this.pageType === 'query' || this.storagePrefix.includes('draft')) {
                    this.addCard(false);
                }
            } else {
                // Select first
                this.selectedCardId = this.cards[0].id;
                // Lazy load first result
                this.loadResultForCard(this.cards[0]);
            }
        } else {
            // Same logic, don't auto-add for history
            if (this.pageType === 'query' || this.storagePrefix.includes('draft')) {
                this.addCard(false);
            } else {
                this.cards = [];
                this.selectedCardId = null;
            }
        }

        this.renderCards();
        this.renderResultPanel();
    }

    private async loadResultForCard(card: NotebookCard) {
        if (card.result) return; // Already loaded
        if (card.status !== 'success') return; // No result to load

        const resultKey = `${this.storagePrefix}${card.id}/result`;
        const result = await this.store.getItem<any>(resultKey);

        if (result) {
            card.result = result;
            // Re-render result panel if this card is still selected
            if (this.selectedCardId === card.id) {
                this.renderResultPanel();
            }
        }
    }

    private async selectCard(id: string) {
        if (this.selectedCardId === id) return;
        this.selectedCardId = id;

        const card = this.cards.find(c => c.id === id);
        if (card) {
            // Lazy Load Result logic
            if (!card.result && card.status === 'success') {
                this.renderResultPanel(); // Shows loading/empty temporarily
                await this.loadResultForCard(card);
            } else {
                this.renderResultPanel();
            }
        }

        this.renderCards(false); // Update active class
    }

    public addCard(save = true, select = true) { // Added select param
        if (this.readOnly) return;

        const newCard: NotebookCard = {
            id: crypto.randomUUID(),
            sql: '',
            params: '',
            status: 'idle'
        };
        this.cards.push(newCard);

        if (select) {
            this.selectedCardId = newCard.id;
        }

        if (save) {
            this.saveCardMetadata(newCard);
            this.saveOrder();
        }
        this.renderCards();
        if (select) {
            this.renderResultPanel();
        }
    }

    public clearAll() {
        if (this.readOnly) return;

        if (confirm("Are you sure you want to clear all cards?")) {
            // Cleanup current cards from store
            this.cards.forEach(c => this.deleteCardFromStore(c.id));

            this.cards = [];
            this.selectedCardId = null;
            this.addCard(true);
        }
    }

    public async cleanupEmptyCards() {
        const cardsToRemove = this.cards.filter(c => c.status === 'idle' && !c.sql.trim());
        for (const card of cardsToRemove) {
            await this.removeCard(card.id);
        }
    }

    private removeCard(id: string) {
        if (this.readOnly) return;

        if (this.cards.length <= 1) {
            // Don't remove the last card, just clear it
            const card = this.cards[0];
            card.sql = '';
            card.params = '';
            card.result = undefined;
            card.error = undefined;
            card.status = 'idle';
            card.readOnly = false; // Reset lock
            this.selectedCardId = card.id;

            // Delete old result if any
            this.store.removeItem(`${this.storagePrefix}${card.id}/result`);
            this.saveCardMetadata(card);
        } else {
            this.cards = this.cards.filter(c => c.id !== id);
            // If active was removed, select previous or next
            if (this.selectedCardId === id) {
                // Simple logic: select last available
                const last = this.cards[this.cards.length - 1];
                this.selectedCardId = last ? last.id : null;
            }
            this.deleteCardFromStore(id);
            this.saveOrder();
        }

        // If we switched selection, ensure result is loaded
        if (this.selectedCardId) {
            const card = this.cards.find(c => c.id === this.selectedCardId);
            if (card) this.loadResultForCard(card);
        }

        this.renderCards();
        this.renderResultPanel();
    }

    // --- Persistence Helpers ---

    private async saveOrder() {
        const order = this.cards.map(c => c.id);
        await this.store.setItem(this.storagePrefix + '_order', order);
    }

    private async saveCardMetadata(card: NotebookCard) {
        // Clone and strip result to avoid saving huge blobs in metadata
        const metadata = { ...card };
        delete metadata.result;
        await this.store.setItem(this.storagePrefix + card.id, metadata);
    }

    private async saveCardResult(card: NotebookCard) {
        if (card.result) {
            await this.store.setItem(`${this.storagePrefix}${card.id}/result`, card.result);
        }
    }

    private async deleteCardFromStore(id: string) {
        await this.store.removeItem(this.storagePrefix + id);
        await this.store.removeItem(`${this.storagePrefix}${id}/result`);
    }

    // --- Execution ---

    private async handleRun(id: string) {
        if (this.readOnly) return;

        const card = this.cards.find(c => c.id === id);
        if (!card) return;

        // Cannot run if locked
        if (card.readOnly) return;

        this.selectCard(id);

        // Update UI state
        card.status = 'running';
        card.error = undefined;
        card.result = undefined; // Clear in memory

        this.updateCardStatusUI(card);
        this.renderResultPanel(); // Show loading state

        try {
            const result = await this.runCallback(card.sql, card.params);

            // Process result
            card.status = 'success';
            if (result.stats?.durationMs) {
                card.executionTimeMs = result.stats.durationMs;
            }

            if (result.result.case === 'select') {
                card.result = {
                    columns: result.result.value.columns,
                    rows: result.result.value.rows,
                };
            } else if (result.result.case === 'dml') {
                card.result = {
                    rowsAffected: result.result.value.rowsAffected.toString(),
                    lastInsertId: result.result.value.lastInsertId.toString()
                };
            }

            // Save everything
            this.saveCardResult(card);

            // Transaction Mode Specific Logic
            if (this.pageType === 'transaction') {
                card.readOnly = true; // Lock this step
                // Auto-create next step, BUT keep selection on current result so user can see what happened
                this.addCard(true, false);
            }

        } catch (e: any) {
            card.status = 'error';
            card.error = e.message || "Unknown error";
        }

        this.saveCardMetadata(card);
        this.updateCardStatusUI(card);
        this.renderResultPanel();

        // If we added a card, we need a full re-render anyway to show it
        if (this.pageType === 'transaction' && card.status === 'success') {
            this.renderCards();
        }
    }

    // --- Rendering ---

    private renderCards(full = true) {
        if (full) {
            this.cardContainer.innerHTML = this.cards.map(c => this.generateCardHTML(c)).join('');

            // Restore values
            this.cards.forEach(c => {
                const cardEl = this.cardContainer.querySelector(`.notebook-card[data-id="${c.id}"]`);
                if (!cardEl) return;

                const sqlEditor = cardEl.querySelector('.sql-editor') as HTMLTextAreaElement;
                const paramsEditor = cardEl.querySelector('.params-editor') as HTMLTextAreaElement;

                if (sqlEditor) sqlEditor.value = c.sql;
                if (paramsEditor) paramsEditor.value = c.params;
            });
        }

        // Update active class
        this.cardContainer.querySelectorAll('.notebook-card').forEach(el => {
            if ((el as HTMLElement).dataset.id === this.selectedCardId) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    private updateCardStatusUI(card: NotebookCard) {
        const cardEl = this.cardContainer.querySelector(`.notebook-card[data-id="${card.id}"]`);
        if (!cardEl) return;

        const runBtn = cardEl.querySelector('.run-btn') as HTMLButtonElement;
        const durationEl = cardEl.querySelector('.duration') as HTMLElement;
        const controlsEl = cardEl.querySelector('.card-actions');

        if (runBtn) {
            if (this.readOnly || card.readOnly) {
                runBtn.disabled = true;
                runBtn.textContent = card.status === 'success' ? 'Executed' : 'Run';
            } else {
                runBtn.disabled = card.status === 'running';
                runBtn.textContent = card.status === 'running' ? 'Running...' : 'Run';
            }
        }

        // Also update textareas disabled state if readOnly Changed dynamically
        const sqlEditor = cardEl.querySelector('.sql-editor') as HTMLTextAreaElement;
        const paramsEditor = cardEl.querySelector('.params-editor') as HTMLTextAreaElement;
        const isLocked = this.readOnly || card.readOnly;

        if (sqlEditor) sqlEditor.disabled = !!isLocked;
        if (paramsEditor) paramsEditor.disabled = !!isLocked;


        // Update duration if exists or append
        let existingDuration = cardEl.querySelector('.duration');
        if (card.executionTimeMs) {
            if (existingDuration) {
                existingDuration.textContent = `${card.executionTimeMs}ms`;
            } else if (controlsEl) {
                const span = document.createElement('span');
                span.className = 'duration';
                span.textContent = `${card.executionTimeMs}ms`;
                controlsEl.appendChild(span);
            }
        } else if (existingDuration) {
            existingDuration.remove();
        }
    }

    // Renders the DETAIL view in the right pane for selected card
    private renderResultPanel() {
        if (!this.selectedCardId) {
            this.resultContainer.innerHTML = '<div class="empty-state">Select a query to see results.</div>';
            return;
        }

        const card = this.cards.find(c => c.id === this.selectedCardId);
        if (!card) {
            this.resultContainer.innerHTML = '<div class="empty-state">Card not found.</div>';
            return;
        }

        let content = '';

        if (card.status === 'running') {
            content = '<div class="loading-state">Executing Query...</div>';
        } else if (card.status === 'error') {
            content = `<div class="error-msg">${card.error}</div>`;
        } else if (card.result) {
            content = this.generateResultHTML(card);
        } else if (card.status === 'success' && !card.result) {
            // Should theoretically be lazy loading, but if we got here and it's missing, it might be empty result or loading
            content = '<div class="loading-state">Loading result data...</div>';
        } else if (this.readOnly) {
            content = '<div class="empty-state">No result recorded.</div>';
        } else {
            content = '<div class="empty-state">Run the query to see results.</div>';
        }

        this.resultContainer.innerHTML = `
            <div class="result-header">
                <strong>Result</strong>
                ${card.executionTimeMs ? `<span class="badge success">${card.executionTimeMs}ms</span>` : ''}
            </div>
            <div class="result-body">
                ${content}
            </div>
        `;
    }

    private generateCardHTML(card: NotebookCard): string {
        const isRunning = card.status === 'running';
        const isActive = card.id === this.selectedCardId ? ' active' : '';
        // Lock if Global ReadOnly OR Individual Card ReadOnly
        const isLocked = this.readOnly || card.readOnly;

        const disabledAttr = isLocked ? 'disabled' : '';
        // Hide run button if locked? Or just disable? User requested "make readonly"
        // Let's keep it visible but disabled to show it was run
        const runBtnDisabled = isLocked || isRunning ? 'disabled' : '';
        const runBtnText = isRunning ? 'Running...' : (isLocked && card.status === 'success' ? 'Executed' : 'Run');

        // Remove button should probably be hidden if locked to prevent accidental history modification
        const removeBtnStyle = isLocked ? 'style="display:none"' : '';

        return `
        <div class="notebook-card${isActive}" data-id="${card.id}">
            <div class="card-controls">
                <button class="btn btn-sm remove-btn" title="Remove Card" ${removeBtnStyle}>&times;</button>
            </div>
            <div class="card-inputs">
                <div class="input-group">
                    <label>SQL</label>
                    <textarea class="sql-editor" rows="3" placeholder="SELECT * FROM ..." ${disabledAttr}>${card.sql}</textarea>
                </div>
                <div class="input-group">
                     <textarea class="params-editor" rows="1" placeholder='{"id": 1}' ${disabledAttr}>${card.params}</textarea>
                </div>
            </div>
            <div class="card-actions">
                 <button class="btn btn-primary run-btn" ${runBtnDisabled}>
                    ${runBtnText}
                 </button>
                 ${card.executionTimeMs ? `<span class="duration">${card.executionTimeMs}ms</span>` : ''}
            </div>
        </div>
        `;
    }

    private generateResultHTML(card: NotebookCard): string {
        if (!card.result) return '';

        if (card.result.rowsAffected) {
            return `
            <div class="dml-success">
                <div class="stat">
                    <div class="label">Rows Affected</div>
                    <div class="value">${card.result.rowsAffected}</div>
                </div>
                ${card.result.lastInsertId ? `
                <div class="stat">
                    <div class="label">Last Insert ID</div>
                    <div class="value">${card.result.lastInsertId}</div>
                </div>` : ''}
            </div>`;
        }

        if (card.result.columns && card.result.rows) {
            if (card.result.rows.length === 0) {
                return '<div class="empty-msg">No rows returned</div>';
            }
            const headers = card.result.columns.map(c => `<th>${c}</th>`).join('');
            const body = card.result.rows.map((row: any) => {
                const cells = row.values.map((v: any) => `<td>${this.formatValue(v)}</td>`).join('');
                return `<tr>${cells}</tr>`;
            }).join('');

            return `
            <div class="table-wrapper">
                <table>
                    <thead><tr>${headers}</tr></thead>
                    <tbody>${body}</tbody>
                </table>
            </div>`;
        }

        return '';
    }

    private formatValue(val: any): string {
        try {
            const unwrapped = toJson(ValueSchema, val);
            if (unwrapped === null || unwrapped === undefined) return '<span class="null">NULL</span>';
            if (typeof unwrapped === 'object') return JSON.stringify(unwrapped);
            return String(unwrapped);
        } catch (e) {
            return String(val);
        }
    }
}
