const {
  usecase, step, Ok, Err
} = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const Transaction = require('../../entities/transaction');
const TransactionRepository = require('../../../infra/data/repositories/transactionRepository');

const dependency = { TransactionRepository };

const deleteTransaction = (injection) => usecase('Delete Transaction', {
  // Input/Request metadata and validation
  request: {
    id: String
  },

  // Output/Response metadata
  response: Boolean,

  // Authorization with Audit
  // authorize: (user) => (user.canDeleteTransaction ? Ok() : Err()),
  authorize: () => Ok(),

  setup: (ctx) => {
    ctx.di = Object.assign({}, dependency, injection);
    ctx.data = {};
  },

  'Check if the Transaction exist': step(async (ctx) => {
    const { id } = ctx.req;
    const repo = new ctx.di.TransactionRepository(injection);

    const [transaction] = await repo.getTransactionByIdAndUserId(id, ctx.user.id);

    ctx.data.transaction = transaction;

    if (transaction) return Ok();
    return Err.notFound({
      message: `Transaction ID ${ctx.req.id} does not exist`,
      payload: { entity: 'Transaction' }
    });
  }),

  'Delete the Transaction': step(async (ctx) => {
    const repo = new ctx.di.TransactionRepository(injection);
    ctx.ret = await repo.delete(ctx.data.transaction);
    return Ok(ctx.ret);
  })
});

module.exports = herbarium.usecases
  .add(deleteTransaction, 'DeleteTransaction')
  .metadata({
    group: 'Transaction', operation: herbarium.crud.delete, entity: Transaction, REST: { delete: '/v1/transactions/:id' }
  })
  .usecase;
