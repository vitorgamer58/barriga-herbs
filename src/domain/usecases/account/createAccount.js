const {
  usecase, step, Ok, Err, request
} = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const Account = require('../../entities/account');
const AccountRepository = require('../../../infra/data/repositories/accountRepository');

const dependency = { AccountRepository };

const createAccount = (injection) => usecase('Create Account', {
  request: request.from(Account, { ignoreIDs: true }),

  response: Account,

  authorize: (user) => (user.id ? Ok() : Err()),

  setup: (ctx) => (ctx.di = Object.assign({}, dependency, injection)),

  'Check if the Account is valid': step((ctx) => {
    ctx.account = Account.fromJSON(ctx.req);
    ctx.account.id = Math.floor(Math.random() * 100000).toString();
    ctx.account.user_id = ctx.user.id;

    if (!ctx.account.isValid()) {
      return Err.invalidEntity({
        message: 'The Account entity is invalid',
        payload: { entity: 'Account' },
        cause: ctx.account.errors
      });
    }

    // returning Ok continues to the next step. Err stops the use case execution.
    return Ok();
  }),

  'Save the Account': step(async (ctx) => {
    const repo = new ctx.di.AccountRepository(injection);
    const { account } = ctx;
    // ctx.ret is the return value of a use case
    return (ctx.ret = await repo.insert(account));
  })
});

module.exports = herbarium.usecases
  .add(createAccount, 'CreateAccount')
  .metadata({
    group: 'Account', operation: herbarium.crud.create, entity: Account, REST: { post: '/v1/accounts' }
  })
  .usecase;
