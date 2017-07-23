import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import { createNetworkInterface } from 'apollo-client';

import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import {
    ApolloClient,
    //gql,
    //graphql,
    ApolloProvider,
    createNetworkInterface,
} from 'react-apollo';

const wsClient = new SubscriptionClient(`ws://localhost:3001/subscriptions`, {
      reconnect: true
});

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:3001/graphql'
});

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
);

//const client = new ApolloClient({
      //networkInterface,
//});

// Finally, create your ApolloClient instance with the modified network interface
const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);
