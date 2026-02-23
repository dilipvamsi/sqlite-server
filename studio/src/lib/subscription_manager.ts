import localforage from 'localforage';
import { getClient, getAuthHeaders } from './client';
import { DatabaseService } from '../gen/sqlrpc/v1/db_service_pb';

export interface SubscriptionCard {
    id: string;
    payload: string;
    status: 'idle' | 'running' | 'success' | 'error';
    error?: string;
}

export interface ReceivedMessage {
    id: string;
    payload: string;
    timestamp: number;
}

const STORE_NAME = 'sqlite-studio-subscription';

export class SubscriptionManager {
    private store: LocalForage;
    private dbName: string;
    private cardContainer: HTMLElement;
    private messageContainer: HTMLElement;

    private channel: string = '';
    private subscriptionName: string = '';
    private cards: SubscriptionCard[] = [];
    private messages: ReceivedMessage[] = [];
    private isSubscribed: boolean = false;
    private abortController: AbortController | null = null;

    private storagePrefix: string;

    constructor(
        dbName: string,
        cardContainer: HTMLElement,
        messageContainer: HTMLElement
    ) {
        this.dbName = dbName;
        this.cardContainer = cardContainer;
        this.messageContainer = messageContainer;

        this.store = localforage.createInstance({
            name: 'sqlite-studio',
            storeName: STORE_NAME
        });

        this.storagePrefix = `${this.dbName}/subscription/`;
        this.init();
    }

    private async init() {
        await this.loadData();
        this.renderAll();

        // Event Delegation for cards
        this.cardContainer.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const btn = target.closest('button');
            if (!btn) return;

            const cardEl = target.closest('.notebook-card') as HTMLElement;
            if (!cardEl) return;
            const cardId = cardEl.dataset.id!;

            if (btn.classList.contains('publish-btn')) {
                this.handlePublish(cardId);
            } else if (btn.classList.contains('remove-btn')) {
                this.removeCard(cardId);
            }
        });

        this.cardContainer.addEventListener('input', (e) => {
            const target = e.target as HTMLTextAreaElement;
            if (!target.matches('.payload-editor')) return;

            const cardEl = target.closest('.notebook-card') as HTMLElement;
            if (!cardEl) return;
            const cardId = cardEl.dataset.id!;

            const card = this.cards.find(c => c.id === cardId);
            if (card) {
                card.payload = target.value;
                this.saveData();
            }
        });
    }

    private async loadData() {
        const data = await this.store.getItem<any>(this.storagePrefix + 'state');
        if (data) {
            this.channel = data.channel || '';
            this.subscriptionName = data.subscriptionName || '';
            this.cards = data.cards || [];
            this.messages = data.messages || [];
        }

        if (this.cards.length === 0) {
            this.addCard(false);
        }
    }

    private async saveData() {
        await this.store.setItem(this.storagePrefix + 'state', {
            channel: this.channel,
            subscriptionName: this.subscriptionName,
            cards: this.cards,
            messages: this.messages
        });
    }

    public updateConfig(channel: string, subscriptionName: string) {
        this.channel = channel;
        this.subscriptionName = subscriptionName;
        this.saveData();
    }

    public addCard(save = true) {
        const card: SubscriptionCard = {
            id: crypto.randomUUID(),
            payload: '',
            status: 'idle'
        };
        this.cards.push(card);
        if (save) {
            this.saveData();
            this.renderCards();
        }
    }

    public removeCard(id: string) {
        if (this.cards.length <= 1) {
            const card = this.cards[0];
            card.payload = '';
            card.status = 'idle';
            card.error = undefined;
        } else {
            this.cards = this.cards.filter(c => c.id !== id);
        }
        this.saveData();
        this.renderCards();
    }

    public async handlePublish(id: string) {
        const card = this.cards.find(c => c.id === id);
        if (!card) return;

        if (!this.channel.trim()) {
            alert('Please enter a channel name in global configuration.');
            return;
        }

        card.status = 'running';
        card.error = undefined;
        this.renderCards();

        try {
            const client = getClient(DatabaseService);
            const headers = getAuthHeaders();
            const response = await client.publish({
                database: this.dbName,
                channel: this.channel,
                payload: card.payload
            }, { headers });

            card.status = 'success';
            console.log('Published message ID:', response.messageId);
        } catch (e: any) {
            card.status = 'error';
            card.error = e.message || 'Unknown error';
        }

        this.saveData();
        this.renderCards();
    }

    public async toggleSubscription(onMessage: (msg: ReceivedMessage) => void) {
        if (this.isSubscribed) {
            this.unsubscribe();
            return;
        }

        if (!this.channel.trim() || !this.subscriptionName.trim()) {
            alert('Please enter both channel and subscription name.');
            return;
        }

        this.isSubscribed = true;
        this.abortController = new AbortController();

        try {
            const client = getClient(DatabaseService);
            const headers = getAuthHeaders();

            const stream = client.subscribe({
                database: this.dbName,
                channel: this.channel,
                subscriptionName: this.subscriptionName
            }, {
                headers,
                signal: this.abortController.signal
            });

            for await (const msg of stream) {
                const receivedMsg: ReceivedMessage = {
                    id: msg.messageId.toString(),
                    payload: msg.payload,
                    timestamp: Date.now()
                };
                this.messages.unshift(receivedMsg); // Newest first
                if (this.messages.length > 1000) this.messages.pop(); // Limit history
                this.saveData();
                onMessage(receivedMsg);
                this.renderMessages();
            }
        } catch (e: any) {
            // Check if it's a ConnectError with code 'canceled'
            if (e.name === 'AbortError' || e.code === 1 || e.message?.includes('canceled')) {
                return;
            }
            console.error('Subscription error:', e);
            alert('Subscription error: ' + e.message);
            this.unsubscribe();
        }
    }

    public unsubscribe() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        this.isSubscribed = false;
        this.renderAll();
    }

    public clearMessages() {
        this.messages = [];
        this.saveData();
        this.renderMessages();
    }

    public getSubscriptionStatus() {
        return this.isSubscribed;
    }

    public getChannel() { return this.channel; }
    public getSubscriptionName() { return this.subscriptionName; }
    public getMessages() { return this.messages; }

    private renderAll() {
        this.renderCards();
        this.renderMessages();
    }

    private renderCards() {
        this.cardContainer.innerHTML = this.cards.map(c => `
            <div class="notebook-card" data-id="${c.id}">
                <div class="card-header-row">
                    <span class="badge">Payload Card</span>
                    <button class="btn btn-sm remove-btn" title="Remove Card">&times;</button>
                </div>
                <div class="card-inputs">
                    <textarea class="payload-editor" rows="3" placeholder="Enter message payload...">${c.payload}</textarea>
                </div>
                <div class="card-actions">
                    ${c.error ? `<span class="error-text">${c.error}</span>` : ''}
                    <button class="btn btn-primary publish-btn" ${c.status === 'running' ? 'disabled' : ''}>
                        ${c.status === 'running' ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    public renderMessages() {
        if (this.messages.length === 0) {
            this.messageContainer.innerHTML = `
                <div class="result-body">
                    <div class="empty-state">No messages received yet.</div>
                </div>
            `;
            return;
        }

        const rows = this.messages.map(m => {
            const date = new Date(m.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour12: false });
            const ms = (m.timestamp % 1000).toString().padStart(3, '0');
            const fullTime = `${timeStr}.${ms}`;

            return `
                <tr>
                    <td class="id-cell">${m.id}</td>
                    <td class="payload-cell-container">
                        <div class="payload-wrapper">
                            <pre class="payload-cell">${m.payload}</pre>
                            <button class="copy-payload-btn" title="Copy Payload">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </button>
                        </div>
                    </td>
                    <td class="time-cell">${fullTime}</td>
                </tr>
            `;
        }).join('');

        this.messageContainer.innerHTML = `
            <div class="result-body">
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th class="id-cell">ID</th>
                                <th class="payload-cell-container">Payload</th>
                                <th class="time-cell">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
}
