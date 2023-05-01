exports.up = async function (knex) {
  knex.schema.hasTable('users')
    .then((exists) => {
      if (exists) return;
      return knex.schema
        .createTable('users', (table) => {
          table.string('id').primary();
          table.string('name');
          table.string('email');
          table.string('passwd');
          table.timestamps();
        });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users');
};
