const { entity, id, field } = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');

const Transaction = entity('Transaction', {
  id: id(String),
  description: field(String, {
    validation: { presence: true }
  }),
  ammount: field(Number, {
    validation: { presence: true }
  }),
  date: field(Date),
  acc_id: field(String, {
    validation: { presence: true }
  }),
  type: field(String, {
    validation: { contains: { allowed: ['I', 'O'] } }
  }),
  status: field(Boolean, {
    validation: { presence: false }
  })
});

module.exports = herbarium.entities.add(Transaction, 'Transaction').entity;
