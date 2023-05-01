/* eslint-disable max-classes-per-file */
const assert = require('assert');
const {
  spec, scenario, given, check, samples
} = require('@herbsjs/herbs').specs;
const { herbarium } = require('@herbsjs/herbarium');
const createAccount = require('./createAccount');

const createAccountSpec = spec({

  usecase: createAccount,

  'Create a new account when it is valid': scenario({
    'Given a valid account': given({
      request: {
        name: 'a text',
        user_id: 'a text'
      },
      user: { hasAccess: true },
      injection: {
        AccountRepository: class AccountRepository {
          static async insert(account) { return (account); }
        }
      }
    }),

    // when: default when for use case

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk);
    }),

    'Must return a valid account': check((ctx) => {
      assert.strictEqual(ctx.response.ok.isValid(), true);
      // TODO: check if it is really a account
    })

  }),

  'Do not create a new account when it is invalid': scenario({
    'Given a invalid account': given({
      request: {
        name: true,
        user_id: true
      },
      user: { hasAccess: true },
      injection: {
        accountRepository: new (class AccountRepository {
          static async insert(account) { return (account); }
        })()
      }
    }),

    // when: default when for use case

    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr);
      // assert.ok(ret.isInvalidEntityError)
    })

  })
});

module.exports = herbarium.specs
  .add(createAccountSpec, 'CreateAccountSpec')
  .metadata({ usecase: 'CreateAccount' })
  .spec;
