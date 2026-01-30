// index.d.ts
import * as grpc from "@grpc/grpc-js";

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

export enum TransactionType {
  STREAMING = 1,
  UNARY = 2,
}


export enum ColumnAffinity {
  COLUMN_AFFINITY_UNSPECIFIED = 0,
  COLUMN_AFFINITY_INTEGER = 1,
  COLUMN_AFFINITY_TEXT = 2,
  COLUMN_AFFINITY_BLOB = 3,
  COLUMN_AFFINITY_REAL = 4,
  COLUMN_AFFINITY_NUMERIC = 5,
}

export enum DeclaredType {
  DECLARED_TYPE_UNSPECIFIED = 0,
  DECLARED_TYPE_INT = 1,
  DECLARED_TYPE_INTEGER = 2,
  DECLARED_TYPE_TINYINT = 3,
  DECLARED_TYPE_SMALLINT = 4,
  DECLARED_TYPE_MEDIUMINT = 5,
  DECLARED_TYPE_BIGINT = 6,
  DECLARED_TYPE_UNSIGNED_BIG_INT = 7,
  DECLARED_TYPE_INT2 = 8,
  DECLARED_TYPE_INT8 = 9,
  DECLARED_TYPE_CHARACTER = 10,
  DECLARED_TYPE_VARCHAR = 11,
  DECLARED_TYPE_VARYING_CHARACTER = 12,
  DECLARED_TYPE_NCHAR = 13,
  DECLARED_TYPE_NATIVE_CHARACTER = 14,
  DECLARED_TYPE_NVARCHAR = 15,
  DECLARED_TYPE_TEXT = 16,
  DECLARED_TYPE_CLOB = 17,
  DECLARED_TYPE_BLOB = 18,
  DECLARED_TYPE_REAL = 19,
  DECLARED_TYPE_DOUBLE = 20,
  DECLARED_TYPE_DOUBLE_PRECISION = 21,
  DECLARED_TYPE_FLOAT = 22,
  DECLARED_TYPE_NUMERIC = 23,
  DECLARED_TYPE_DECIMAL = 24,
  DECLARED_TYPE_BOOLEAN = 25,
  DECLARED_TYPE_DATE = 26,
  DECLARED_TYPE_DATETIME = 27,
  DECLARED_TYPE_TIMESTAMP = 28,
  DECLARED_TYPE_JSON = 29,
  DECLARED_TYPE_UUID = 30,
  DECLARED_TYPE_TIME = 31,
  DECLARED_TYPE_YEAR = 32,
  DECLARED_TYPE_CHAR = 33,
  DECLARED_TYPE_XML = 34,
}

export enum SavepointAction {
  SAVEPOINT_ACTION_UNSPECIFIED = 0,
  SAVEPOINT_ACTION_CREATE = 1,
  SAVEPOINT_ACTION_RELEASE = 2,
  SAVEPOINT_ACTION_ROLLBACK = 3,
}

export enum CheckpointMode {
  CHECKPOINT_MODE_UNSPECIFIED = 0,
  CHECKPOINT_MODE_PASSIVE = 1,
  CHECKPOINT_MODE_FULL = 2,
  CHECKPOINT_MODE_RESTART = 3,
  CHECKPOINT_MODE_TRUNCATE = 4,
}

// --- Interfaces ---

export interface SQLStatement {
  text: string;
  values: any[];
  name?: string;
}

export interface QueryHints {
  /** Key is the 0-based index of the parameter */
  positional?: Record<number, ColumnAffinity>;
  /** Key is the parameter name (e.g. ":id") */
  named?: Record<string, ColumnAffinity>;
}

export interface ExecutionStats {
  duration_ms: number;
  rows_read: number;
  rows_written: number;
}

export interface SelectResult {
  type: "SELECT";
  columns: string[];
  columnAffinities: ColumnAffinity[];
  columnDeclaredTypes: DeclaredType[];
  columnRawTypes: string[];
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

export interface ExplainNode {
  id: number;
  parentId: number;
  detail: string;
}

export interface IterateResult {
  columns: string[];
  columnAffinities: ColumnAffinity[];
  columnDeclaredTypes: DeclaredType[];
  columnRawTypes: string[];
  rows: AsyncIterable<any[]>;
}

export interface BatchStreamResult {
  columns: string[];
  columnAffinities: ColumnAffinity[];
  columnDeclaredTypes: DeclaredType[];
  columnRawTypes: string[];
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

export interface TransactionResult {
  success: boolean;
}

export interface SavepointResult {
  success: boolean;
  name: string;
  action: SavepointAction;
}

export interface VacuumResult {
  success: boolean;
  message: string;
}

export interface CheckpointResult {
  success: boolean;
  message: string;
  busyCheckpoints: number;
  logCheckpoints: number;
  checkpointedPages: number;
}

export interface IntegrityCheckResult {
  success: boolean;
  message: string;
  errors: string[];
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
  ): Promise<SavepointResult>;

  /** Commits the transaction and closes the stream. */
  commit(): Promise<TransactionResult>;

  /** Rolls back the transaction and closes the stream. */
  rollback(): Promise<TransactionResult>;
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

export interface TypeParsersConfig {
  bigint?: boolean;
  json?: boolean;
  blob?: boolean;
  date?: 'date' | 'string' | 'number';
}

export interface ClientConfig {
  retry?: RetryConfig;
  interceptors?: Interceptor[];
  auth?: AuthConfig;
  credentials?: grpc.ChannelCredentials;
  typeParsers?: TypeParsersConfig;
}

/**
 * Manages a Unary (ID-Based) Transaction.
 * All operations use a transaction ID and are stateless relative to the connection.
 * Supports streaming results via the TransactionQueryStream RPC.
 */
export class UnaryTransactionHandle {
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
  ): Promise<SavepointResult>;

  /** Commits the transaction. */
  commit(): Promise<TransactionResult>;

  /** Rolls back the transaction. */
  rollback(): Promise<TransactionResult>;
}

export class DatabaseClient {
  /**
   * Creates a new client bound to a specific database.
   * @param address - gRPC server address (e.g. "localhost:50051")
   * @param databaseName - The logical database name in config.json
   * @param config - Configuration options (including auth and credentials)
   */
  constructor(address: string, databaseName: string, config?: ClientConfig);

  /** Closes the underlying gRPC channel. */
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
   * Returns the structured EXPLAIN QUERY PLAN for a given query.
   */
  explain(statement: SQLStatement, hints?: QueryHints): Promise<ExplainNode[]>;
  explain(
    sql: string,
    params?: MixedParams,
    hints?: QueryHints,
  ): Promise<ExplainNode[]>;

  /**
   * Opens a bidirectional stream transaction.
   * @param mode - Locking mode (Default: DEFERRED). Use IMMEDIATE for write-heavy transactions.
   */
  executeTransaction(
    queries: (QueryRequestItem | string | SQLStatement)[],
    mode?: TransactionMode,
  ): Promise<BufferedResult[]>;

  beginTransaction(mode?: TransactionMode, type?: TransactionType): Promise<TransactionHandle | UnaryTransactionHandle>;

  transaction(
    fn: (tx: TransactionHandle | UnaryTransactionHandle, ...args: any[]) => Promise<any>,
    mode?: TransactionMode,
    type?: TransactionType,
    ...args: any[]
  ): Promise<any>;

  vacuum(intoFile?: string): Promise<VacuumResult>;

  checkpoint(mode: CheckpointMode): Promise<CheckpointResult>;

  integrityCheck(maxErrors?: number): Promise<IntegrityCheckResult>;

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
