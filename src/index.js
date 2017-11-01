import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import './styles/index.css'

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

import gql from 'graphql-tag';

import { BrowserRouter } from 'react-router-dom'

const httpLink = createHttpLink({
    uri: 'https://api.graph.cool/simple/v1/cj9g4efez5cec0129dh1nsc2p',
  })

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

client.query({ query: gql`{
  allLinks {
    description
	}
}` }).then(console.log);

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App {...client}/>
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root')
)
registerServiceWorker()
