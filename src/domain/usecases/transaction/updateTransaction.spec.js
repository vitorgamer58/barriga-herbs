const Transaction = require('../../entities/transaction')
const updateTransaction = require('./updateTransaction')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateTransactionSpec = spec({

    usecase: updateTransaction,
    'Update a existing transaction when it is valid': scenario({

      'Valid transactions': samples([
        {
          id: 'a text',
        description: 'a text',
        amount: 99,
        acc_id: 'a text',
        type: 'a text',
        status: true
        },
        {
          id: 'a text',
        description: 'a text',
        amount: 99,
        acc_id: 'a text',
        type: 'a text',
        status: true
        }
      ]),
      
      'Valid transactions Alternative': samples([
        {
          id: 'a text',
        description: 'a text',
        amount: 99,
        acc_id: 'a text',
        type: 'a text',
        status: true
        },
        {
          id: 'a text',
        description: 'a text',
        amount: 99,
        acc_id: 'a text',
        type: 'a text',
        status: true
        }
      ]),

      'Given a valid transaction': given((ctx) => ({
        request: ctx.sample,
        user: { hasAccess: true }
      })),

      'Given a repository with a existing transaction': given((ctx) => ({
        injection: {
            TransactionRepository: class TransactionRepository {
              async findByID(id) { 
                const fakeTransaction = {
                    id: 'a text',
        description: 'a text',
        amount: 99,
        acc_id: 'a text',
        type: 'a text',
        status: true
                }
                return ([Transaction.fromJSON(fakeTransaction)])              }
              async update(id) { return true }
            }
          },
      })),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must confirm update': check((ctx) => {
        assert.ok(ctx.response.ok === true)
      })

    }),

    'Do not update a transaction when it is invalid': scenario({
      'Given a invalid transaction': given({
        request: {
          id: true,
        description: true,
        amount: true,
        date: true,
        acc_id: true,
        type: true,
        status: true
        },
        user: { hasAccess: true },
        injection: {},
      }),

      // when: default when for use case

      'Must return an error': check((ctx) => {
        assert.ok(ctx.response.isErr)  
        // assert.ok(ctx.response.isInvalidEntityError)
      }),

    }),

    'Do not update transaction if it does not exist': scenario({
        'Given an empty transaction repository': given({
          request: {
              id: 'a text',
        description: 'a text',
        amount: 99,
        acc_id: 'a text',
        type: 'a text',
        status: true
          },
          user: { hasAccess: true },
          injection:{
            TransactionRepository: class TransactionRepository {
              async findByID(id) { return [] }
            }
          },
        }),
  
        // when: default when for use case
  
        'Must return an error': check((ctx) => {
          assert.ok(ctx.response.isErr)
          assert.ok(ctx.response.isNotFoundError)  
        }),
      }),
  })
  
module.exports =
  herbarium.specs
    .add(updateTransactionSpec, 'UpdateTransactionSpec')
    .metadata({ usecase: 'UpdateTransaction' })
    .spec