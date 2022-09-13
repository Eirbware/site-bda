import {ApolloClient, DefaultOptions, HttpLink, InMemoryCache} from '@apollo/client/core';

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    }
};

// Create Apollo client
const client = new ApolloClient({
    cache: new InMemoryCache({
        addTypename: false
    }),
    link: new HttpLink({
        // @ts-ignore
        uri: `${import.meta.env.VITE_BACKEND_ADDRESS}/graphql`,
        credentials: 'include', // SUPER IMPORTANT : ApolloServer's context breaks if this is not set to 'include'
    }),
    defaultOptions,
});

export default client;