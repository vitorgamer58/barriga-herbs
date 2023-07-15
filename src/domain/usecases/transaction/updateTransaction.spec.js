/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

const assert = require('assert');
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs;
const { herbarium } = require('@herbsjs/herbarium');
const Transaction = require('../../entities/transaction');
const updateTransaction = require('./updateTransaction');

const updateTransactionSpec = spec({
  usecase: updateTransaction,
  'Update a existing transaction when it is valid': scenario({
    'Given a valid transaction': given({
      request: Transaction.fromJSON({
        id: '123',
        description: '#PRAYFORUKRAINE',
        ammount: 125,
        date: Date.now(),
        acc_id: '5',
        type: 'O',
        status: true
      }),
      user: { id: '1' }
    }),

    'Given a repository with a existing transaction': given((ctx) => ({
      injection: {
        TransactionRepository: class TransactionRepository {
          async getTransactionByIdAndUserId(_) {
            const fakeTransaction = {
              id: '123',
              description: '#PRAYFORUKRAINE',
              ammount: 125,
              date: Date.now(),
              acc_id: '5',
              type: 'O',
              status: false
            };
            return [Transaction.fromJSON(fakeTransaction)];
          }

          async update(transaction) {
            return transaction;
          }
        }
      }
    })),

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk);
    }),

    'Must confirm update': check((ctx) => {
      assert.ok(ctx.response.ok.status === true);
    })
  }),

  'Do not update a transaction when it is invalid': scenario({
    'Given a invalid transaction': given({
      request: Transaction.fromJSON({
        id: true,
        description: true,
        amount: true,
        date: true,
        acc_id: true,
        type: true,
        status: true
      }),
      user: { id: '1' },
      injection: {}
    }),

    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr);
    })
  }),

  'Do not update transaction if it does not exist': scenario({
    'Given an empty transaction repository': given({
      request: Transaction.fromJSON({
        id: 'a text',
        description: 'a text',
        amount: 99,
        acc_id: 'a text',
        type: 'a text',
        status: true
      }),
      user: { id: '1' },
      injection: {
        TransactionRepository: class TransactionRepository {
          async getTransactionByIdAndUserId(_) {
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

module.exports = herbarium.specs
  .add(updateTransactionSpec, 'UpdateTransactionSpec')
  .metadata({ usecase: 'UpdateTransaction' }).spec;
