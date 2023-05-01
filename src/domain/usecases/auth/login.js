const {
  usecase, step, Ok, Err, ifElse, request
} = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const loginRequest = require('../../entities/loginRequest');
const UserRepository = require('../../../infra/data/repositories/userRepository');
const { EncryptDecrypt } = require('../../helpers/EncryptDecrypt');
const { JWT } = require('../../helpers/JWT');
const findUser = require('../user/findUser');

const dependency = {
  UserRepository,
  encryptDecrypt: EncryptDecrypt,
  jwt: new JWT(),
  findUserUsecase: findUser
};

const login = (injection) => usecase('Autenticate a user', {
  request: request.from(loginRequest, { ignoreIDs: true }),

  response: { token: String },

  authorize: () => Ok(),

  setup: (ctx) => {
    ctx.di = Object.assign({}, dependency, injection);
    ctx.data = {};
  },

  'Verify input': step((ctx) => {
    ctx.data.login = loginRequest.fromJSON(ctx.req);

    if (!ctx.data.login.isValid()) {
      return Err.invalidEntity({
        message: 'The login is invalid',
        payload: { entity: 'loginRequest' },
        cause: ctx.user.errors
      });
    }

    return Ok();
  }),

  'Find user': step(async (ctx) => {
    const { findUserUsecase } = ctx.di;
    const { email } = ctx.req;

    const usecaseInstance = findUserUsecase(injection);
    await usecaseInstance.authorize();

    const ucReturn = await usecaseInstance.run({
      email
    });

    if (ucReturn.isErr) {
      return Err.notFound({
        message: 'Email not found',
        payload: { email }
      });
    }

    const user = ucReturn.ok;
    ctx.data.user = user;

    return Ok();
  }),

  'Verify if password match': ifElse({
    'Password match': step((ctx) => {
      const { encryptDecrypt } = ctx.di;
      const { passwd } = ctx.req;
      const { user } = ctx.data;

      return Ok(encryptDecrypt.comparePasswords(passwd, user.passwd));
    }),

    'Then: Generate JWT token and return': step((ctx) => {
      const { jwt } = ctx.di;
      const { user } = ctx.data;

      delete user.passwd;

      ctx.ret.token = jwt.generateJWT(user);

      return Ok();
    }),

    'Else: Return error': step((ctx) => Err.invalidArguments('Invalid password'))
  })

});

module.exports = herbarium.usecases
  .add(login, 'Login')
  .metadata({
    group: 'Auth', entity: loginRequest, operation: herbarium.crud.other, REST: { post: '/auth/signin' }
  })
  .usecase;
