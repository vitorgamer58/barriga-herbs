const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const User = require('../../entities/user');
const UserRepository = require('../../../infra/data/repositories/userRepository');

const dependency = { UserRepository };

const createUser = (injection) =>
  usecase('Create User', {
    request: request.from(User, { ignoreIDs: true }),

    response: User,

    authorize: () => Ok(),

    setup: (ctx) => {
      ctx.di = Object.assign({}, dependency, injection);
      ctx.data = {};
    },

    'Check if the User is valid': step((ctx) => {
      ctx.data.user = User.fromJSON(ctx.req);
      ctx.data.user.id = Math.floor(Math.random() * 100000).toString();

      if (!ctx.data.user.isValid()) {
        return Err.invalidEntity({
          message: 'The User entity is invalid',
          payload: { entity: 'User' },
          cause: ctx.data.user.errors
        });
      }

      return Ok();
    }),

    'Save the User': step(async (ctx) => {
      const repo = new ctx.di.UserRepository(injection);
      const { user } = ctx.data;
      return (ctx.ret = await repo.insert(user));
    })
  });

module.exports = herbarium.usecases.add(createUser, 'CreateUser').metadata({ group: 'User', entity: User }).usecase;
