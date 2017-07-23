import React from 'react'
import {
    gql,
    graphql,
} from 'react-apollo';


const messagesSubscription = gql`
    subscription {
        paymentAdded {
            _id
            date
            description
            amount
        }
    }
`;



class Data extends React.Component {

    componentWillMount() {
        this.props.data.subscribeToMore({
            document: messagesSubscription,
            //variables: {
                //channelId: this.props.match.params.channelId,
            //},
            updateQuery: (prev, {subscriptionData}) => {
                // nothing from now on
                if (!subscriptionData.data) {
                    return prev;
                }

                const newPayment = subscriptionData.data.paymentAdded;
                return Object.assign({}, prev, {
                    payments: [...prev.payments, newPayment]
                });
            }
        });
    }

    render() {
        const { data: { loading, error, payments }} = this.props;

        if (loading) {
            return <p>Loading ...</p>;
        }
        if (error) {
            return <p>{error.message}</p>;
        }
        return <ul>
        { payments.map( ch => <li key={ch._id}>
            {new Date(ch.date).toString()}
            {ch.amount}
            {ch.description}
        </li> ) }
        </ul>;
    }
}

const paymentListQuery = gql`
query {
  payments {
    _id
    date
    description
    amount
  }
}
`;
const DataWithData = graphql(paymentListQuery)(Data);

export default DataWithData
