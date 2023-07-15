const { usecase, step, Ok, Err } = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const Account = require('../../entities/account');
const AccountRepository = require('../../../infra/data/repositories/accountRepository');

const dependency = { AccountRepository };

const deleteAccount = (injection) =>
  usecase('Delete Account', {
    // Input/Request metadata and validation
    request: {
      id: String
    },

    // Output/Response metadata
    response: Boolean,

    // Authorization with Audit
    // authorize: (user) => (user.canDeleteAccount ? Ok() : Err()),
    authorize: (user) => Ok(),

    setup: (ctx) => (ctx.di = Object.assign({}, dependency, injection)),

    'Check if the Account exist': step(async (ctx) => {
      const repo = new ctx.di.AccountRepository(injection);
      const { id } = ctx.req;
      const { user } = ctx;

      const [account] = await repo.find({
        id,
        user_id: user.id
      });
      ctx.account = account;

      if (account) return Ok();
      return Err.notFound({
        message: `Account ID ${ctx.req.id} does not exist`,
        payload: { entity: 'Account' }
      });
    }),

    'Delete the Account': step(async (ctx) => {
      const repo = new ctx.di.AccountRepository(injection);
      ctx.ret = await repo.delete(ctx.account);
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret);
    })
  });

module.exports = herbarium.usecases.add(deleteAccount, 'DeleteAccount').metadata({
  group: 'Account',
  operation: herbarium.crud.delete,
  entity: Account,
  REST: { delete: '/v1/accounts/:id' }
}).usecase;
