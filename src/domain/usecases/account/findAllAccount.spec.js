const assert = require('assert');
const {
  spec, scenario, given, check, samples
} = require('@herbsjs/herbs').specs;
const { herbarium } = require('@herbsjs/herbarium');
const Account = require('../../entities/account');
const findAllAccount = require('./findAllAccount');

const findAllAccountSpec = spec({

  usecase: findAllAccount,

  'Find all accounts': scenario({
    'Given an existing account': given({
      request: { limit: 0, offset: 0 },
      user: { hasAccess: true },
      injection: {
        AccountRepository: class AccountRepository {
          static async findAll(id) {
            const fakeAccount = {
              id: 'a text',
              name: 'a text',
              user_id: 'a text'
            };
            return ([Account.fromJSON(fakeAccount)]);
          }
        }
      }
    }),

    // when: default when for use case

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk);
    }),

    'Must return a list of accounts': check((ctx) => {
      assert.strictEqual(ctx.response.ok.length, 1);
    })

  })

});

module.exports = herbarium.specs
  .add(findAllAccountSpec, 'FindAllAccountSpec')
  .metadata({ usecase: 'FindAllAccount' })
  .spec;
