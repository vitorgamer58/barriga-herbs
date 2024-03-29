/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
const { herbarium } = require('@herbsjs/herbarium');
const assert = require('assert');
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs;
const User = require('../../entities/user');
const findUser = require('./findUser');

const findUserSpec = spec({
  usecase: findUser,

  'Find a user when it exists': scenario({
    'Given an existing user': given({
      request: {
        id: 'a text'
      },
      user: { hasAccess: true },
      injection: {
        UserRepository: class UserRepository {
          async findByID(id) {
            const fakeUser = {
              id: 'a text',
              email: 'abc@abc.com',
              name: 'a text',
              passwd: 'a text'
            };
            return [User.fromJSON(fakeUser)];
          }
        }
      }
    }),

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk);
    }),

    'Must return a valid user': check((ctx) => {
      assert.strictEqual(ctx.response.ok.isValid(), true);
    })
  }),

  'Do not find a user when it does not exist': scenario({
    'Given an empty user repository': given({
      request: {
        id: 'a text'
      },
      user: { hasAccess: true },
      injection: {
        UserRepository: class UserRepository {
          async findByID(id) {
            return [];
          }
        }
      }
    }),

    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr);
      assert.ok(ctx.response.isNotFoundError);
    })
  })
});

module.exports = herbarium.specs.add(findUserSpec, 'FindUserSpec').metadata({ usecase: 'FindUser' }).spec;
