import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import './styles/index.css'

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

import { ApolloLink } from 'apollo-link';
import { GC_AUTH_TOKEN } from './constants'

import gql from 'graphql-tag';

import { BrowserRouter } from 'react-router-dom'

const httpLink = createHttpLink({
  uri: 'https://api.graph.cool/simple/v1/cj9g4efez5cec0129dh1nsc2p',
})

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem(GC_AUTH_TOKEN) || null
    }
  });
  console.log('operation', operation.getContext());
  return forward(operation)
})

const link = middlewareLink.concat(httpLink);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});


ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App {...client}/>
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root')
)
registerServiceWorker()
