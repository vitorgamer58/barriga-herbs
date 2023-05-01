const createTransaction = require('./createTransaction')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createTransactionSpec = spec({

    usecase: createTransaction,
  
    'Create a new transaction when it is valid': scenario({
      'Given a valid transaction': given({
        request: {
            description: 'a text',
        amount: 99,
        acc_id: 'a text',
        type: 'a text',
        status: true
        },
        user: { hasAccess: true },
        injection: {
            TransactionRepository: class TransactionRepository {
              async insert(transaction) { return (transaction) }
            }
        },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must return a valid transaction': check((ctx) => {
        assert.strictEqual(ctx.response.ok.isValid(), true)
        // TODO: check if it is really a transaction
      })

    }),

    'Do not create a new transaction when it is invalid': scenario({
      'Given a invalid transaction': given({
        request: {
          description: true,
        amount: true,
        date: true,
        acc_id: true,
        type: true,
        status: true
        },
        user: { hasAccess: true },
        injection: {
            transactionRepository: new ( class TransactionRepository {
              async insert(transaction) { return (transaction) }
            })
        },
      }),

      // when: default when for use case

      'Must return an error': check((ctx) => {
        assert.ok(ctx.response.isErr)  
        // assert.ok(ret.isInvalidEntityError)
      }),

    }),
  })
  
module.exports =
  herbarium.specs
    .add(createTransactionSpec, 'CreateTransactionSpec')
    .metadata({ usecase: 'CreateTransaction' })
    .spec