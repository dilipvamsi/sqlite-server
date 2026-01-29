// index.d.ts

// --- Enums ---

export enum SqliteCode {
    SQLITE_CODE_OK = 0,
    SQLITE_CODE_ERROR = 1,
    SQLITE_CODE_INTERNAL = 2,
    SQLITE_CODE_PERM = 3,
    SQLITE_CODE_ABORT = 4,
    SQLITE_CODE_BUSY = 5,
    SQLITE_CODE_LOCKED = 6,
    SQLITE_CODE_NOMEM = 7,
    SQLITE_CODE_READONLY = 8,
    SQLITE_CODE_INTERRUPT = 9,
    SQLITE_CODE_IOERR = 10,
    SQLITE_CODE_CORRUPT = 11,
    SQLITE_CODE_NOTFOUND = 12,
    SQLITE_CODE_FULL = 13,
    SQLITE_CODE_CANTOPEN = 14,
    SQLITE_CODE_PROTOCOL = 15,
    SQLITE_CODE_EMPTY = 16,
    SQLITE_CODE_SCHEMA = 17,
    SQLITE_CODE_TOOBIG = 18,
    SQLITE_CODE_CONSTRAINT = 19,
    SQLITE_CODE_MISMATCH = 20,
    SQLITE_CODE_MISUSE = 21,
    SQLITE_CODE_NOLFS = 22,
    SQLITE_CODE_AUTH = 23,
    SQLITE_CODE_FORMAT = 24,
    SQLITE_CODE_RANGE = 25,
    SQLITE_CODE_NOTADB = 26,
    SQLITE_CODE_NOTICE = 27,
    SQLITE_CODE_WARNING = 28,
    SQLITE_CODE_ROW = 100,
    SQLITE_CODE_DONE = 101,
}

export enum TransactionMode {
    TRANSACTION_MODE_UNSPECIFIED = 0,
    TRANSACTION_MODE_DEFERRED = 1,
    TRANSACTION_MODE_IMMEDIATE = 2,
    TRANSACTION_MODE_EXCLUSIVE = 3,
}


export enum ColumnType {
    COLUMN_TYPE_UNSPECIFIED = 0,
    COLUMN_TYPE_NULL = 1,
    COLUMN_TYPE_INTEGER = 2,
    COLUMN_TYPE_FLOAT = 3,
    COLUMN_TYPE_TEXT = 4,
    COLUMN_TYPE_BLOB = 5,
    COLUMN_TYPE_BOOLEAN = 6,
    COLUMN_TYPE_DATE = 7,
    COLUMN_TYPE_JSON = 8,
}

export enum SavepointAction {
    SAVEPOINT_ACTION_UNSPECIFIED = 0,
    SAVEPOINT_ACTION_CREATE = 1,
    SAVEPOINT_ACTION_RELEASE = 2,
    SAVEPOINT_ACTION_ROLLBACK = 3,
}

// --- Interfaces ---

export interface SQLStatement {
    text: string;
    values: any[];
    name?: string;
}

export interface QueryHints {
    /** Key is the 0-based index of the parameter */
    positional?: Record<number, ColumnType>;
    /** Key is the parameter name (e.g. ":id") */
    named?: Record<string, ColumnType>;
}

export interface ExecutionStats {
    duration_ms: number;
    rows_read: number;
    rows_written: number;
}

export interface SelectResult {
    type: "SELECT";
    columns: string[];
    columnTypes: ColumnType[];
    rows: any[][];
    stats?: ExecutionStats;
}

export interface DmlResult {
    type: "DML";
    rowsAffected: number;
    lastInsertId: number;
    stats?: ExecutionStats;
}

export type BufferedResult = SelectResult | DmlResult;

export interface IterateResult {
    columns: string[];
    columnTypes: ColumnType[];
    rows: AsyncIterable<any[]>;
}

export interface BatchStreamResult {
    columns: string[];
    columnTypes: ColumnType[];
    rows: AsyncIterable<any[][]>;
}

export interface MixedParams {
    positional?: any[];
    named?: Record<string, any>;
}

export interface QueryRequestItem {
    sql: string | SQLStatement;
    params?: MixedParams;
    hints?: QueryHints;
}

// --- Classes ---

export class TransactionHandle {
    /**
     * Executes a query and buffers the result in memory.
     * Use this for DML or small SELECTs.
     */
    query(statement: SQLStatement, hints?: QueryHints): Promise<BufferedResult>;
    query(
        sql: string,
        params?: MixedParams,
        hints?: QueryHints,
    ): Promise<BufferedResult>;

    /**
     * Executes a query and yields rows one by one.
     * Efficient for reading medium-large datasets.
     */
    iterate(statement: SQLStatement, hints?: QueryHints): Promise<IterateResult>;
    iterate(
        sql: string,
        params?: MixedParams,
        hints?: QueryHints,
    ): Promise<IterateResult>;

    /**
     * Executes a query and yields batches of rows.
     * Best for ETL or very large datasets.
     * @param batchSize - Client-side re-batching size (default 500).
     */
    queryStream(
        statement: SQLStatement,
        hints?: QueryHints,
        batchSize?: number,
    ): Promise<BatchStreamResult>;
    queryStream(
        sql: string,
        params?: MixedParams,
        hints?: QueryHints,
        batchSize?: number,
    ): Promise<BatchStreamResult>;

    /** Manages a SQLite Savepoint (Nested Transaction). */
    savepoint(
        name: string,
        action: SavepointAction,
    ): Promise<{ success: boolean; name: string; action: SavepointAction }>;

    /** Commits the transaction and closes the stream. */
    commit(): Promise<{ success: boolean }>;

    /** Rolls back the transaction and closes the stream. */
    rollback(): Promise<{ success: boolean }>;
}

export interface RetryConfig {
    maxRetries?: number;
    baseDelayMs?: number;
}

export interface Interceptor {
    beforeQuery?: (req: { sql?: string; params?: any; type?: string; queries?: any[] }) => void;
    afterQuery?: (result: any) => void;
    onError?: (err: Error) => void;
}

export interface BasicAuthConfig {
    type: 'basic';
    username: string;
    password: string;
}

export interface BearerAuthConfig {
    type: 'bearer';
    token: string;
}

export type AuthConfig = BasicAuthConfig | BearerAuthConfig;

export interface ClientConfig {
    dateHandling?: 'date' | 'string' | 'number';
    retry?: RetryConfig;
    interceptors?: Interceptor[];
    auth?: AuthConfig;
    // No gRPC credentials in fetch client
}


export class DatabaseClient {
    /**
     * Creates a new client bound to a specific database.
     * @param address - URL address (e.g. "http://localhost:50051")
     * @param database - The logical database name
     * @param config - Configuration options (including auth)
     */
    constructor(address: string, database: string, config?: ClientConfig);

    /** No-op for fetch client but kept for compatibility. */
    close(): void;

    query(statement: SQLStatement, hints?: QueryHints): Promise<BufferedResult>;
    query(
        sql: string,
        params?: MixedParams,
        hints?: QueryHints,
    ): Promise<BufferedResult>;

    iterate(statement: SQLStatement, hints?: QueryHints): Promise<IterateResult>;
    iterate(
        sql: string,
        params?: MixedParams,
        hints?: QueryHints,
    ): Promise<IterateResult>;

    queryStream(
        statement: SQLStatement,
        hints?: QueryHints,
        batchSize?: number,
    ): Promise<BatchStreamResult>;
    queryStream(
        sql: string,
        params?: MixedParams,
        hints?: QueryHints,
        batchSize?: number,
    ): Promise<BatchStreamResult>;

    /**
     * Opens a bidirectional stream transaction.
     * @param mode - Locking mode (Default: DEFERRED). Use IMMEDIATE for write-heavy transactions.
     */
    executeTransaction(
        queries: (QueryRequestItem | string | SQLStatement)[],
        mode?: TransactionMode,
    ): Promise<BufferedResult[]>;

    beginTransaction(mode?: TransactionMode): Promise<TransactionHandle>;

    transaction(
        fn: (tx: TransactionHandle, ...args: any[]) => Promise<any>,
        mode?: TransactionMode,
        ...args: any[]
    ): Promise<any>;

    /** Helper to convert a row array into an object using column names. */
    static toObject(columns: string[], row: any[]): Record<string, any>;
}


// --- Utilities ---

export const toObject: (columns: string[], row: any[]) => Record<string, any>;

/**
 * Tag function for sql-template-strings.
 * Example: SQL`SELECT * FROM users WHERE id = ${id}`
 */
export const SQL: (
    strings: TemplateStringsArray,
    ...values: any[]
) => SQLStatement;
