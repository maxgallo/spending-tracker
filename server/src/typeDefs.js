const typeDefs = [`
    scalar Date

    type MyType {
       created: Date
    }

    type Query {
        currencies: [Currency]
        paymentMethods: [PaymentMethod]
        paymentTypes: [PaymentType]
        payments: [Payment]
        paymentsInTimeRange(fromDate: Date!, toDate: Date!): [Payment]
    }

    type Currency {
        _id: String
        name: String
        sign: String
    }

    type PaymentMethod {
        _id: String
        name: String
        currency: Currency
        currencyId: String
    }

    type PaymentType {
        _id: String
        name: String
    }

    type Payment {
        _id: String
        date: Date
        amount: Float
        paymentMethodId: String
        paymentMethod: PaymentMethod
        paymentTypeId: String
        paymentType: PaymentType
        description: String
    }

    type Mutation {
        createCurrency(name: String!, sign: String!): Currency
        createPaymentMethod(name: String!, currencyId: String!): PaymentMethod
        createPaymentType(name: String!): PaymentType
        createPayment(date: Date!, amount: Float!, paymentMethodId: String!, paymentTypeId: String!): Payment
    }

    schema {
        query: Query
        mutation: Mutation
    }
`];

export default typeDefs
