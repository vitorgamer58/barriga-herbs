/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
const assert = require('assert');
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs;
const { herbarium } = require('@herbsjs/herbarium');
const Account = require('../../entities/account');
const deleteAccount = require('./deleteAccount');

const deleteAccountSpec = spec({
  usecase: deleteAccount,

  'Delete account if exists': scenario({
    'Given an existing account': given({
      request: {
        id: '50'
      },
      user: { id: '1' },
      injection: {
        AccountRepository: class AccountRepository {
          async delete(entity) {
            return true;
          }

          async find(where) {
            return [{ id: '1' }];
          }
        }
      }
    }),

    // when: default when for use case

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk);
    }),

    'Must confirm deletion': check((ctx) => {
      assert.ok(ctx.response.ok === true);
    })
  }),

  'Do not delete account if it does not exist': scenario({
    'Given an empty account repository': given({
      request: {
        id: 'a text'
      },
      user: { id: '1' },
      injection: {
        AccountRepository: class AccountRepository {
          async find(_) {
            return [];
          }
        }
      }
    }),

    // when: default when for use case

    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr);
      assert.ok(ctx.response.isNotFoundError);
    })
  })
});

module.exports = herbarium.specs
  .add(deleteAccountSpec, 'DeleteAccountSpec')
  .metadata({ usecase: 'DeleteAccount' }).spec;
