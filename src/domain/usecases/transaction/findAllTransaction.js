const {
  usecase, step, Ok, Err
} = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const Transaction = require('../../entities/transaction');
const TransactionRepository = require('../../../infra/data/repositories/transactionRepository');
const findAllAccounts = require('../account/findAllAccount');

const dependency = {
  TransactionRepository,
  findAllAccountsUseCase: findAllAccounts
};

const findAllTransaction = (injection) => usecase('Find all Transactions', {
  request: {
    limit: Number,
    offset: Number
  },

  response: [Transaction],

  authorize: (user) => (user.id ? Ok() : Err()),

  setup: (ctx) => {
    ctx.di = Object.assign({}, dependency, injection);
    ctx.data = {};
  },

  'Find and return all the Transactions of User': step(async (ctx) => {
    const repo = new ctx.di.TransactionRepository(injection);

    const transactions = await repo.getAllByUserId(ctx.user.id);

    return Ok(ctx.ret = transactions);
  })
});

module.exports = herbarium.usecases
  .add(findAllTransaction, 'FindAllTransaction')
  .metadata({
    group: 'Transaction', operation: herbarium.crud.readAll, entity: Transaction, REST: { get: '/v1/transactions' }
  })
  .usecase;
