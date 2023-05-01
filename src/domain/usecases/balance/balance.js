const {
  usecase, step, Ok, Err, entity
} = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const balance = require('../../entities/balance');
const TransactionRepository = require('../../../infra/data/repositories/transactionRepository');
const findAllAccounts = require('../account/findAllAccount');

const dependency = {
  TransactionRepository,
  findAllAccountsUseCase: findAllAccounts
};

const getBalance = (injection) => usecase('Get the user balance', {
  request: {},

  response: [balance],

  authorize: (user) => (user.id ? Ok() : Err()),

  setup: (ctx) => {
    ctx.di = Object.assign({}, dependency, injection);
    ctx.data = {};
  },

  'Get the balance of user': step(async (ctx) => {
    const repo = new ctx.di.TransactionRepository(injection);

    const saldos = await repo.getSaldos(ctx.user.id);

    return Ok(ctx.ret = saldos);
  })
});

module.exports = herbarium.usecases
  .add(getBalance, 'Get the user balance')
  .metadata({
    group: 'Balance', operation: herbarium.crud.readAll, entity: balance, REST: { get: '/v1/balance' }
  })
  .usecase;
