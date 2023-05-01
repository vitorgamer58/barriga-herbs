const {
  usecase, step, Ok, Err
} = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const Transaction = require('../../entities/transaction');
const TransactionRepository = require('../../../infra/data/repositories/transactionRepository');

const dependency = { TransactionRepository };

const findTransaction = (injection) => usecase('Find a Transaction', {
  request: {
    id: String
  },

  response: Transaction,

  authorize: (user) => (user.id ? Ok() : Err()),

  setup: (ctx) => (ctx.di = Object.assign({}, dependency, injection)),

  'Find and return the Transaction': step(async (ctx) => {
    const { id } = ctx.req;
    const repo = new ctx.di.TransactionRepository(injection);

    const [transaction] = await repo.findByID(id);
    if (!transaction) {
      return Err.notFound({
        message: `Transaction entity not found by ID: ${id}`,
        payload: { entity: 'Transaction', id }
      });
    }
    // ctx.ret is the return value of a use case
    return Ok(ctx.ret = transaction);
  })
});

module.exports = herbarium.usecases
  .add(findTransaction, 'FindTransaction')
  .metadata({
    group: 'Transaction', operation: herbarium.crud.read, entity: Transaction, REST: { get: '/v1/transactions/:id' }
  })
  .usecase;
