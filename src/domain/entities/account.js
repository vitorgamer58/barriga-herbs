const { entity, id, field } = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');

const Account = entity('Account', {
  id: id(String),
  name: field(String, {
    validation: { presence: true }
  }),
  user_id: id(String, {
    validation: { presence: true }
  })
});

module.exports = herbarium.entities.add(Account, 'Account').entity;
