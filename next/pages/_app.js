import App, { Container } from 'next/app'
import React from 'react'
import { ToastProvider } from 'react-toast-notifications';
import withApolloClient from '../lib/with-apollo-client'
import { ApolloProvider } from 'react-apollo'

class MyApp extends App {
  render () {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <Container>
        <ToastProvider>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </ToastProvider>
        
      </Container>
    )
  }
}

export default withApolloClient(MyApp)
