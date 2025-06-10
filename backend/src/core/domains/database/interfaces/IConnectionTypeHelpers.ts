import PostgresAdapter from "@src/core/domains/postgres/adapters/PostgresAdapter";

/**
 * Type helper for the connection adapters
 */
export type IConnectionTypeHelpers = {
    ['default']: PostgresAdapter;
    ['postgres']: PostgresAdapter;
}