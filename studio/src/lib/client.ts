import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import type { GenService } from "@bufbuild/protobuf/codegenv1";

/**
 * Creates a Connect transport that points to the Go backend.
 * In development, we might need to point to localhost:50051 explicitly if not proxied.
 * In production (embedded), it's the same origin.
 */
export const transport = createConnectTransport({
    baseUrl: import.meta.env.DEV ? "http://localhost:50051" : window.location.origin,
});

/**
 * Helper to create a client for a given service.
 */
export function getClient<T extends GenService<any>>(service: T) {
    return createClient(service, transport);
}

// Authentication Helpers
export const AUTH_KEY = "sqlite-server-auth"; // Stores API Key
export const AUTH_USER = "sqlite-server-user"; // Stores username

export function getAuthHeaders() {
    const apiKey = localStorage.getItem(AUTH_KEY);
    if (!apiKey) return {};

    return {
        Authorization: `Bearer ${apiKey}`,
    };
}

// Active Transaction Tracking (for global logout with rollback)
export const ACTIVE_TX_KEY = "sqlite-server-active-tx";

export interface ActiveTransactionInfo {
    txId: string;
    dbName: string;
}

export function setActiveTransaction(txId: string, dbName: string) {
    console.log("[DEBUG] Setting active transaction:", txId, dbName);
    localStorage.setItem(ACTIVE_TX_KEY, JSON.stringify({ txId, dbName }));
}

export function clearActiveTransaction() {
    console.log("[DEBUG] Clearing active transaction");
    localStorage.removeItem(ACTIVE_TX_KEY);
}

export function getActiveTransaction(): ActiveTransactionInfo | null {
    const stored = localStorage.getItem(ACTIVE_TX_KEY);
    console.log("[DEBUG] Getting active transaction, stored:", stored);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

// Global Logout Utility
export async function performLogout() {
    console.log("[DEBUG] performLogout called");
    const { DatabaseService } = await import("../gen/db/v1/db_service_pb");
    const localforage = (await import("localforage")).default;

    // Check for active transaction and rollback
    const activeTx = getActiveTransaction();
    console.log("[DEBUG] Active transaction found:", activeTx);
    if (activeTx) {
        try {
            const client = getClient(DatabaseService);
            const headers = getAuthHeaders() as HeadersInit;
            console.log("[DEBUG] Calling rollbackTransaction for:", activeTx.txId);
            await client.rollbackTransaction({ transactionId: activeTx.txId }, { headers });
            console.log("[DEBUG] Rolled back active transaction on logout:", activeTx.txId);
        } catch (e) {
            console.error("[DEBUG] Failed to rollback transaction on logout:", e);
        }
        clearActiveTransaction();
    }

    // Clear all local data
    await localforage.clear();
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_USER);
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    // Redirect to login
    window.location.href = '/studio/login';
}
