/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
const assert = require('assert');
const { expect } = require('chai');
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs;
const { herbarium } = require('@herbsjs/herbarium');
const createUser = require('./register');

const createUserSpec = spec({
  usecase: createUser,

  'Create a new user when it is valid': scenario({
    'Given a valid user': given({
      request: {
        name: 'A normal user',
        email: 'a@a.com',
        passwd: 'abc123456'
      },
      injection: {
        UserRepository: class UserRepository {
          async insert(user) {
            return user;
          }
        }
      }
    }),

    // when: default when for use case

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk);
    }),

    'Must return a valid user': check((ctx) => {
      // TODO: check if it is really a user
    })
  }),

  'Do not create a new user when it is invalid': scenario({
    'Given a invalid user': given({
      request: {
        name: true,
        email: true,
        passwd: true
      },
      injection: {
        UserRepository: class UserRepository {
          async insert(user) {
            return user;
          }
        }
      }
    }),

    // when: default when for use case

    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr);
      // assert.ok(ret.isInvalidEntityError)
    })
  })
});

module.exports = herbarium.specs.add(createUserSpec, 'CreateUserSpec').metadata({ usecase: 'CreateUser' }).spec;
