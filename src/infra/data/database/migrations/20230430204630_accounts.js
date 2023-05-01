exports.up = async function (knex) {
  knex.schema.hasTable('accounts')
    .then((exists) => {
      if (exists) return;
      return knex.schema
        .createTable('accounts', (table) => {
          table.string('id').primary();
          table.string('name').notNull();
          table.string('user_id')
            .references('id')
            .inTable('users')
            .notNull();
          table.timestamps();
        });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('accounts');
};
