exports.up = async function (knex) {
  knex.schema.hasTable('transactions').then((exists) => {
    if (exists) return;
    return knex.schema.createTable('transactions', (table) => {
      table.string('id').primary();
      table.string('description').notNull();
      table.decimal('ammount', 15, 2).notNull();
      table.timestamp('date').notNull();
      table.string('acc_id').references('id').inTable('accounts').notNull();
      table.enum('type', ['I', 'O']).notNull();
      table.boolean('status').notNull().default(false);
    });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('transactions');
};
