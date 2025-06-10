import { IDatabaseConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import DatabaseConfig from '@src/core/domains/database/services/DatabaseConfig';
import PostgresAdapter from '@src/core/domains/postgres/adapters/PostgresAdapter';
import ParsePostgresConnectionUrl from '@src/core/domains/postgres/helper/ParsePostgresConnectionUrl';
import { IPostgresConfig } from '@src/core/domains/postgres/interfaces/IPostgresConfig';

export const testDbName = 'test_db';

const defaultPostgresCredentials = new PostgresAdapter('', {} as IPostgresConfig).getDefaultCredentials()

const postgresConnectionStringWithTestDb: string = (() => {
    const parsed = ParsePostgresConnectionUrl.parse(defaultPostgresCredentials || "")
    parsed.database = testDbName;
    return parsed.toString()
})();

export default class TestDatabaseProvider extends DatabaseProvider {

    protected config: IDatabaseConfig = {
        enableLogging: true,
        defaultConnectionName: 'postgres',
        keepAliveConnections: 'mongodb',
        connections: DatabaseConfig.createConnections([
            DatabaseConfig.createConfig({
                connectionName: 'postgres',
                adapter: PostgresAdapter,
                uri: postgresConnectionStringWithTestDb,
                options: {} // Additional connection options can be specified here
            }),
        ])
    };
    ;

}