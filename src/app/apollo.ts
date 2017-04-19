import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

const graphcoolId = 'cj1p30q4kas5t0170vrew08ig';

// Create WebSocket client
const wsClient = new SubscriptionClient(`wss://subscriptions.graph.cool/v1/${graphcoolId}`, {
  reconnect: true
});
const networkInterface = createNetworkInterface({
  uri: `https://api.graph.cool/simple/v1/${graphcoolId}`,
});

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  addTypename: true,
});

export function provideClient(): ApolloClient {
  return client;
}
