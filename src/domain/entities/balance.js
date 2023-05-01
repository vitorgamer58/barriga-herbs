const { entity, id, field } = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');

const balance = entity('balance', {
  id: id(String),
  sum: field(Number)
});

module.exports = herbarium.entities.add(balance, 'balance').entity;
