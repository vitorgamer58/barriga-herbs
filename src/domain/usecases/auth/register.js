const {
  usecase, step, Ok, Err, request
} = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const User = require('../../entities/user');
const Registerrequest = require('../../entities/registerRequest');
const UserRepository = require('../../../infra/data/repositories/userRepository');
const { EncryptDecrypt } = require('../../helpers/EncryptDecrypt');
const createUser = require('../user/createUser');

const dependency = {
  UserRepository,
  encryptDecrypt: EncryptDecrypt,
  createUserUsecase: createUser()
};

const register = (injection) => usecase('Register a user', {
  request: request.from(Registerrequest, { ignoreIDs: true }),

  response: User,

  authorize: () => Ok(),

  setup: (ctx) => {
    ctx.di = Object.assign({}, dependency, injection);
    ctx.data = {};
  },

  'Check if the User is valid': step((ctx) => {
    ctx.data.userToRegister = Registerrequest.fromJSON(ctx.req);

    if (!ctx.data.userToRegister.isValid()) {
      return Err.invalidEntity({
        message: 'The User entity is invalid',
        payload: { entity: 'User' },
        cause: ctx.data.userToRegister.errors
      });
    }

    return Ok();
  }),

  'Encrypt user password': step((ctx) => {
    const { userToRegister } = ctx.data;
    const { encryptDecrypt } = ctx.di;

    userToRegister.passwd = encryptDecrypt.getPasswdHash(userToRegister.passwd);

    return Ok();
  }),

  'Save the User and return': step(async (ctx) => {
    const { createUserUsecase } = ctx.di;
    const { userToRegister } = ctx.data;

    await createUserUsecase.authorize();
    const ucResponse = await createUserUsecase.run(userToRegister.toJSON());

    if (ucResponse.isErr) return Err('Internal server error');

    const useCreated = ucResponse.ok;

    delete useCreated.passwd;

    ctx.ret = useCreated;

    return Ok();
  })
});

module.exports = herbarium.usecases.add(register, 'Register a User').metadata({
  group: 'Auth',
  operation: herbarium.crud.create,
  entity: Registerrequest,
  REST: { post: '/auth/signup' }
}).usecase;
