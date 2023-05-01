const { entity, id, field } = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');

const RegisterRequest = entity('RegisterRequest', {
  name: field(String, {
    validation: { presence: true }
  }),
  email: field(String, {
    validation: { email: true, presence: true }
  }),
  passwd: field(String, {
    validation: { presence: true, length: { minimum: 4 } }
  })
});

module.exports = herbarium.entities.add(RegisterRequest, 'RegisterRequest').entity;
