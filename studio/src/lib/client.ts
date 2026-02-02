import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import type { GenService } from "@bufbuild/protobuf/codegenv1";

/**
 * Creates a Connect transport that points to the Go backend.
 * Uses PUBLIC_SQLITE_SERVER_URL env var if available, otherwise defaults to "/".
 * In development, we might need to point to localhost:50051 explicitly if not proxied.
 */
export const transport = createConnectTransport({
    baseUrl: import.meta.env.PUBLIC_SQLITE_SERVER_URL || "/",
});

/**
 * Helper to create a client for a given service.
 */
export function getClient<T extends GenService<any>>(service: T) {
    return createClient(service, transport);
}

// Authentication Helpers
export const AUTH_KEY = "sqlite-server-auth"; // Stores API Key
export const AUTH_KEY_ID = "sqlite-server-key-id"; // Stores Session Key ID
export const AUTH_USER = "sqlite-server-user"; // Stores username
export const AUTH_USER_ID = "sqlite-server-user-id"; // Stores user ID (bigint as string)

export function getAuthToken(): string | null {
    return localStorage.getItem(AUTH_KEY);
}

export function getAuthHeaders(): Record<string, string> {
    const apiKey = getAuthToken();
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
    const { DatabaseService, AdminService } = await import("../gen/db/v1/db_service_pb");
    const localforage = (await import("localforage")).default;

    // 1. Rollback Active Transaction
    const activeTx = getActiveTransaction();
    const headers = getAuthHeaders();

    if (activeTx) {
        try {
            const client = getClient(DatabaseService);
            console.log("[DEBUG] Calling rollbackTransaction for:", activeTx.txId);
            await client.rollbackTransaction({ transactionId: activeTx.txId }, { headers });
            console.log("[DEBUG] Rolled back active transaction on logout:", activeTx.txId);
        } catch (e) {
            console.error("[DEBUG] Failed to rollback transaction on logout:", e);
        }
        clearActiveTransaction();
    }

    // 2. Server-side Logout (Revoke Key)
    const keyId = localStorage.getItem(AUTH_KEY_ID);
    if (keyId) {
        try {
            const client = getClient(AdminService);
            await client.logout({ keyId }, { headers });
            console.log("[DEBUG] Server-side logout successful");
        } catch (e) {
            console.error("[DEBUG] Failed to logout from server:", e);
        }
    }

    // 3. Clear all local data (Browser Data)
    // Clear the specific localforage instance used by NotebookManager
    const studioStore = localforage.createInstance({
        name: 'sqlite-studio',
        storeName: 'sqlite-studio-data'
    });
    await studioStore.clear();
    console.log("[DEBUG] Cleared sqlite-studio localforage store");

    // Also clear default localforage
    await localforage.clear();

    // Drop the entire IndexedDB database for complete cleanup
    try {
        await localforage.dropInstance({ name: 'sqlite-studio' });
        console.log("[DEBUG] Dropped sqlite-studio IndexedDB");
    } catch (e) {
        console.error("[DEBUG] Failed to drop IndexedDB:", e);
    }

    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // 4. Redirect to login
    window.location.href = '/studio/login';
}
