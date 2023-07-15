/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
const assert = require('assert');
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs;
const { herbarium } = require('@herbsjs/herbarium');
const Transaction = require('../../entities/transaction');
const deleteTransaction = require('./deleteTransaction');

const deleteTransactionSpec = spec({
  usecase: deleteTransaction,

  'Delete transaction if exists': scenario({
    'Given an existing transaction': given({
      request: {
        id: 'a text'
      },
      user: { hasAccess: true },
      injection: {
        TransactionRepository: class TransactionRepository {
          async delete(entity) {
            return true;
          }

          async getTransactionByIdAndUserId(id, userId) {
            return [{ id, userId }];
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

  'Do not delete transaction if it does not exist': scenario({
    'Given an empty transaction repository': given({
      request: {
        id: 'a text'
      },
      user: { hasAccess: true },
      injection: {
        TransactionRepository: class TransactionRepository {
          async delete(entity) {
            return true;
          }

          async getTransactionByIdAndUserId(id, userId) {
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
  .add(deleteTransactionSpec, 'DeleteTransactionSpec')
  .metadata({ usecase: 'DeleteTransaction' }).spec;
