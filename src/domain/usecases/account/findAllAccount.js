const { usecase, step, Ok } = require('@herbsjs/herbs');
const { herbarium } = require('@herbsjs/herbarium');
const Account = require('../../entities/account');
const AccountRepository = require('../../../infra/data/repositories/accountRepository');

const dependency = { AccountRepository };

const findAllAccount = (injection) => usecase('Find all Accounts', {
  // Input/Request metadata and validation
  request: {
    limit: Number,
    offset: Number
  },

  // Output/Response metadata
  response: [Account],

  // Authorization with Audit
  authorize: () => Ok(),

  setup: (ctx) => (ctx.di = Object.assign({}, dependency, injection)),

  'Find and return all the Accounts': step(async (ctx) => {
    const { user } = ctx;
    const repo = new ctx.di.AccountRepository(injection);
    const accounts = await repo.find({
      where: {
        user_id: user.id
      }
    });
      // ctx.ret is the return value of a use case
    return Ok(ctx.ret = accounts);
  })
});

module.exports = herbarium.usecases
  .add(findAllAccount, 'FindAllAccount')
  .metadata({
    group: 'Account', operation: herbarium.crud.readAll, entity: Account, REST: { get: '/v1/accounts' }
  })
  .usecase;
