module.exports = {
  development: {
    herbsCLI: 'sqlite',
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: 'barriga-database.db'
    },
    migrations: {
      directory: './src/infra/data/database/migrations',
      tableName: 'knex_migrations'
    }
  },
  staging: {},
  production: {}

};
