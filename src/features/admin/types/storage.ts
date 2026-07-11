export type DataStoreKind =
  | "FoundationDB"
  | "RocksDB"
  | "PostgreSQL"
  | "MySQL"
  | "SQLite"
  | "LDAP";

export type BlobStoreKind =
  | "Local"
  | "S3"
  | "Rados"
  | "Azure"
  | "FileSystem"
  | "Redis"
  | "Memory";

export type SearchStoreKind =
  | "Elasticsearch"
  | "Optic"
  | "PostgreSQL"
  | "SQLite"
  | "MySQL";

export interface StalwartDataStore {
  typ: DataStoreKind;
  host?: string;
  port?: number;
  database?: string;
}

export interface StalwartBlobStore {
  typ: BlobStoreKind;
  endpoint?: string;
  bucket?: string;
}

export interface StalwartSearchStore {
  typ: SearchStoreKind;
  endpoint?: string;
}
