import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createNetworkInterface } from 'apollo-client';
import {
    ApolloClient,
    //gql,
    //graphql,
    ApolloProvider,
} from 'react-apollo';

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:3001/graphql'
});
const client = new ApolloClient({
      networkInterface,
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);
