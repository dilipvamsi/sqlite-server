import localforage from 'localforage';

export interface TransactionEntry {
    id: string;
    timestamp: number;
    status: 'active' | 'committed' | 'rolled_back';
    queryCount: number;
}

const STORE_NAME = 'sqlite-studio-data';

export class TransactionHistoryManager {
    private store: LocalForage;
    private dbName: string;

    constructor(dbName: string) {
        this.dbName = dbName;
        this.store = localforage.createInstance({
            name: 'sqlite-studio',
            storeName: STORE_NAME
        });
    }

    private getKey(): string {
        return `${this.dbName}/tx_history`;
    }

    public async getHistory(): Promise<TransactionEntry[]> {
        const history = await this.store.getItem<TransactionEntry[]>(this.getKey());
        return history || [];
    }

    public async addTransaction(id: string) {
        const history = await this.getHistory();
        const newEntry: TransactionEntry = {
            id,
            timestamp: Date.now(),
            status: 'active',
            queryCount: 0
        };
        // Add to beginning
        history.unshift(newEntry);
        await this.store.setItem(this.getKey(), history);
    }

    public async updateStatus(id: string, status: 'committed' | 'rolled_back') {
        const history = await this.getHistory();
        const entry = history.find(e => e.id === id);
        if (entry) {
            entry.status = status;
            await this.store.setItem(this.getKey(), history);
        }
    }

    public async updateQueryCount(id: string, count: number) {
        const history = await this.getHistory();
        const entry = history.find(e => e.id === id);
        if (entry) {
            entry.queryCount = count;
            await this.store.setItem(this.getKey(), history);
        }
    }

    public async deleteTransaction(id: string) {
        // 1. Remove from history index
        let history = await this.getHistory();
        history = history.filter(h => h.id !== id);
        await this.store.setItem(this.getKey(), history);

        // 2. Remove all data for this transaction (Prefix scan)
        const prefix = `${this.dbName}/transaction/${id}/`;
        const keysToRemove: string[] = [];

        await this.store.iterate((value, key, iterationNumber) => {
            if (key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        });

        for (const key of keysToRemove) {
            await this.store.removeItem(key);
        }
    }
}
