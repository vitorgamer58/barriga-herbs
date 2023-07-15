const { usecase, step, Ok, Err, ifElse } = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const User = require('../../entities/user');
const UserRepository = require('../../../infra/data/repositories/userRepository');

const dependency = { UserRepository };

const findUser = (injection) =>
  usecase('Find a User', {
    request: {
      id: String,
      email: String
    },

    response: User,

    authorize: () => Ok(),

    setup: (ctx) => (ctx.di = Object.assign({}, dependency, injection)),

    'Verify Input': step((ctx) => {
      const { id, email } = ctx.req;

      if (!id && !email) return Err('Invalid input');

      return Ok();
    }),

    'Find user by ID or Email': ifElse({
      'ID was passed': step((ctx) => {
        const { id } = ctx.req;

        return Ok(!!id);
      }),

      'Then: Find by ID and return the User': step(async (ctx) => {
        const { id } = ctx.req;
        const repo = new ctx.di.UserRepository(injection);

        const [user] = await repo.findByID(id);

        if (!user) {
          return Err.notFound({
            message: `User entity not found by ID: ${id}`,
            payload: { entity: 'User', id }
          });
        }

        return Ok((ctx.ret = user));
      }),

      'Else: Find by email and return User': step(async (ctx) => {
        const { email } = ctx.req;
        const repo = new ctx.di.UserRepository(injection);

        const [user] = await repo.find({
          where: {
            email
          }
        });

        if (!user) {
          return Err.notFound({
            message: `User entity not found by email: ${email}`,
            payload: { entity: 'User', email }
          });
        }

        return Ok((ctx.ret = user));
      })
    })
  });

module.exports = herbarium.usecases.add(findUser, 'FindUser').metadata({ group: 'User', entity: User }).usecase;
