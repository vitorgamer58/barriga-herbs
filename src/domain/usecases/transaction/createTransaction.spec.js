/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
const assert = require('assert');
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs;
const { herbarium } = require('@herbsjs/herbarium');
const createTransaction = require('./createTransaction');

const createTransactionSpec = spec({
  usecase: createTransaction,

  'Ensure Correct Transaction Amount Sign': scenario({
    'Given a transaction with incorrect amount sign': given({
      request: {
        description: 'Income',
        ammount: -99,
        acc_id: '999',
        type: 'I',
        status: true
      },
      user: { id: 5 },
      injection: {
        TransactionRepository: class TransactionRepository {
          async insert(transaction) {
            return transaction;
          }
        },
        findAllAccountsUseCase() {
          return {
            authorize: () => Promise.resolve(),
            run: () =>
              Promise.resolve({
                ok: [
                  {
                    id: '999',
                    user_id: 5
                  }
                ],
                isErr: false
              })
          };
        }
      }
    }),

    'Must return a transaction with the corrected amount sign': check((ctx) => {
      assert.ok(ctx.response.isOk);
      assert.strictEqual(ctx.response.ok.ammount, 99);
    })
  }),

  'Check if user is owner of transaction account_id': scenario({
    'Given a user who is not the owner of the transaction account_id': given({
      request: {
        description: 'a text',
        amount: 99,
        acc_id: '999',
        type: 'I',
        status: true
      },
      user: { id: 7 },
      injection: {
        TransactionRepository: class TransactionRepository {
          async insert(transaction) {
            return transaction;
          }
        },
        findAllAccountsUseCase() {
          return {
            authorize: () => Promise.resolve(),
            run: () =>
              Promise.resolve({
                ok: [
                  {
                    id: '524',
                    user_id: 7
                  }
                ],
                isErr: false
              })
          };
        }
      }
    }),

    'Must return a permission denied error': check((ctx) => {
      assert.ok(ctx.response.isErr);
      // assert.ok(ret.isPermissionDeniedError)
    })
  })
});

module.exports = herbarium.specs
  .add(createTransactionSpec, 'CreateTransactionSpec')
  .metadata({ usecase: 'CreateTransaction' }).spec;
