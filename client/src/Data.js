import React from 'react'
import {
    gql,
    graphql,
} from 'react-apollo';

const Data = ({ data: { loading, error, payments }}) => {
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
