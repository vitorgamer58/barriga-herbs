const { entity, field } = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');

const LoginRequest = entity('LoginRequest', {
  email: field(String, {
    validation: { email: true, presence: true }
  }),
  passwd: field(String, {
    validation: { presence: true, length: { minimum: 4 } }
  })
});

module.exports = herbarium.entities.add(LoginRequest, 'LoginRequest').entity;
