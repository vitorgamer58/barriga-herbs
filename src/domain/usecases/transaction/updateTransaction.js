const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const merge = require('deepmerge');
const Transaction = require('../../entities/transaction');
const TransactionRepository = require('../../../infra/data/repositories/transactionRepository');

const dependency = { TransactionRepository };

const updateTransaction = (injection) =>
  usecase('Update Transaction', {
    request: request.from(Transaction),

    response: Transaction,

    authorize: (user) => (user.id ? Ok() : Err()),

    setup: (ctx) => {
      ctx.di = Object.assign({}, dependency, injection);
      ctx.data = {};
    },

    'Retrieve the Transaction': step(async (ctx) => {
      const { id } = ctx.req;
      const repo = new ctx.di.TransactionRepository(injection);

      const [transaction] = await repo.getTransactionByIdAndUserId(id, ctx.user.id);

      ctx.data.transaction = transaction;
      if (transaction === undefined) {
        return Err.notFound({
          message: `Transaction not found - ID: ${id}`,
          payload: { entity: 'Transaction' }
        });
      }

      return Ok(transaction);
    }),

    'Check if it is a valid Transaction before update': step((ctx) => {
      const oldTransaction = ctx.data.transaction;
      const newTransaction = Transaction.fromJSON(merge.all([oldTransaction, ctx.req]));
      ctx.data.transaction = newTransaction;

      return newTransaction.isValid()
        ? Ok()
        : Err.invalidEntity({
            message: 'Transaction is invalid',
            payload: { entity: 'Transaction' },
            cause: newTransaction.errors
          });
    }),

    'Update the Transaction': step(async (ctx) => {
      const repo = new ctx.di.TransactionRepository(injection);
      return (ctx.ret = await repo.update(ctx.data.transaction));
    })
  });

module.exports = herbarium.usecases.add(updateTransaction, 'UpdateTransaction').metadata({
  group: 'Transaction',
  operation: herbarium.crud.update,
  entity: Transaction,
  REST: { put: '/v1/transactions/:id' }
}).usecase;
