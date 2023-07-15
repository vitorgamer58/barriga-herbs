const {
  usecase, step, Ok, Err, request, ifElse
} = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const Transaction = require('../../entities/transaction');
const TransactionRepository = require('../../../infra/data/repositories/transactionRepository');
const findAllAccounts = require('../account/findAllAccount');

const dependency = {
  TransactionRepository,
  findAllAccountsUseCase: findAllAccounts
};

const createTransaction = (injection) => usecase('Create Transaction', {
  request: request.from(Transaction, { ignoreIDs: true }),

  response: Transaction,

  authorize: (user) => (user.id ? Ok() : Err()),

  setup: (ctx) => {
    ctx.di = Object.assign({}, dependency, injection);
    ctx.data = {};
  },

  'Check if the Transaction is valid': step((ctx) => {
    ctx.data.transaction = Transaction.fromJSON(ctx.req);
    ctx.data.transaction.id = Math.floor(Math.random() * 100000).toString();

    if (!ctx.data.transaction.isValid()) {
      return Err.invalidEntity({
        message: 'The Transaction entity is invalid',
        payload: { entity: 'Transaction' },
        cause: ctx.data.transaction.errors
      });
    }

    return Ok();
  }),

  'Ensure Correct Transaction Amount Sign': step((ctx) => {
    const { transaction } = ctx.data;

    if ((transaction.type === 'I' && transaction.ammount < 0)
    || (transaction.type === 'O' && transaction.ammount > 0)
    ) {
      transaction.ammount *= -1;
    }
    return Ok();
  }),

  'Check if user is owner of transaction account_id': ifElse({

    'User is owner': step(async (ctx) => {
      const { findAllAccountsUseCase } = ctx.di;
      const { transaction } = ctx.data;

      const usecaseInstance = await findAllAccountsUseCase(injection);

      await usecaseInstance.authorize(ctx.user);
      const ucResponse = await usecaseInstance.run();

      if (ucResponse.isErr) return Err('Internal server error');

      const userAccounts = ucResponse.ok;

      return Ok(userAccounts.some((account) => account.id === transaction.acc_id));
    }),

    'Then: Save the Transaction': step(async (ctx) => {
      const repo = new ctx.di.TransactionRepository(injection);
      const { transaction } = ctx.data;
      return (ctx.ret = await repo.insert(transaction));
    }),

    'Else: Return error': step((ctx) => Err.permissionDenied())
  })
});

module.exports = herbarium.usecases
  .add(createTransaction, 'CreateTransaction')
  .metadata({
    group: 'Transaction', operation: herbarium.crud.create, entity: Transaction, REST: { post: '/v1/transactions' }
  })
  .usecase;
