import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import cors from 'cors'

import typeDefs from './typeDefs';
import { URL, PORT, MONGO_URL } from './constants';

const prepare = (o) => {
    o._id = o._id.toString()
    return o
}

export const start = async () => {
    try {
        const db = await MongoClient.connect(MONGO_URL)

        const Currency = db.collection('currency')
        const PaymentMethod = db.collection('paymentMethod')
        const PaymentType = db.collection('paymentType')
        const Payment = db.collection('payment')


        const resolvers = {
            Query: {
                currencies: async () => {
                    return (await Currency.find({}).toArray()).map(prepare)
                },
                paymentMethods: async () => {
                    return (await PaymentMethod.find({}).toArray()).map(prepare)
                },
                paymentTypes: async () => {
                    return (await PaymentType.find({}).toArray()).map(prepare)
                },
                payments: async () => {
                    return (await Payment.find({}).toArray()).map(prepare)
                },
                paymentsInTimeRange: async ( _, { fromDate, toDate }) => {
                    const result = (await Payment.find({
                        $and:[
                            {
                                "date": {
                                    $gte: fromDate
                                }
                            },
                            {
                                "date": {
                                    $lt: toDate
                                }
                            }
                        ]
                    }).toArray()).map(prepare)

                    return result;
                }
            },
            PaymentMethod: {
                currency : async ({currencyId}) => {
                    return prepare(await Currency.findOne(ObjectId(currencyId)))
                }
            },
            Payment: {
                paymentType: async ({paymentTypeId}) => {
                    return prepare(await PaymentType.findOne(ObjectId(paymentTypeId)))
                },
                paymentMethod: async ({paymentMethodId}) => {
                    return prepare(await PaymentMethod.findOne(ObjectId(paymentMethodId)))
                }
            },
            Date: new GraphQLScalarType({
                name: 'Date',
                description: 'Date custom scalar type',
                parseValue(value) {
                    return new Date(value); // value from the client
                },
                serialize(value) {
                    return value.getTime(); // value sent to the client
                },
                parseLiteral(ast) {
                    if (ast.kind === Kind.INT) {
                        return parseInt(ast.value, 10); // ast value is always in string format
                    }
                    return null;
                },
            }),
            //Post: {
            //comments: async ({_id}) => {
            //return (await Comments.find({postId: _id}).toArray()).map(prepare)
            //}
            //},
            //Comment: {
            //post: async ({postId}) => {
            //return prepare(await Posts.findOne(ObjectId(postId)))
            //}
            //},
            Mutation: {
                createCurrency: async (root, args) => {
                    const res = await Currency.insert(args)
                    return prepare(await Currency.findOne({_id: res.insertedIds[1]}))
                },
                createPaymentType: async (root, args) => {
                    const res = await PaymentType.insert(args)
                    return prepare(await PaymentType.findOne({_id: res.insertedIds[1]}))
                },
                createPaymentMethod: async (root, args) => {
                    const res = await PaymentMethod.insert(args)
                    return prepare(await PaymentMethod.findOne({_id: res.insertedIds[1]}))
                },
                createPayment: async (root, args) => {
                    const res = await Payment.insert(args)
                    return prepare(await Payment.findOne({_id: res.insertedIds[0]}))
                }
            },
        }

        const schema = makeExecutableSchema({
            typeDefs,
            resolvers
        })

        const app = express()

        app.use(cors())

        app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))

        app.use('/graphiql', graphiqlExpress({
            endpointURL: '/graphql'
        }))

        app.listen(PORT, () => {
            console.log(`Visit ${URL}:${PORT}`)
        })

    } catch (e) {
        console.log(e)
    }

}
