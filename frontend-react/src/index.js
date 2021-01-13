import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/client'
import { ToastProvider } from 'react-toast-notifications'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { apolloClient } from './apollo'
import './index.css'
import App from './App'
import { Login } from './components'
import { ErrorBoundary, ErrorPage } from './components/general'
import registerServiceWorker from './registerServiceWorker'
import history from './history'
import ROUTES_SETTINGS from './settings/routes-resolvers.json'

const { CLIENT: { ROUTES: { LOGIN } = {} } = {} } = ROUTES_SETTINGS

ReactDOM.render(

  <ToastProvider autoDismissTimeout={3000}>
    <ApolloHooksProvider client={apolloClient}>
      <ErrorBoundary>
        <Router history={history}>
          <div className='container'>
            <Switch>
              <Route exact path={LOGIN} component={Login} />
              <Route exact path='/' render={() => <Redirect to='/app' />} />
              <Route path='/app' component={App} />
              <Route exact path='/error-page/:error' component={ErrorPage} />
              <Route component={ErrorPage} />
            </Switch>
          </div>
          <div className='footer bg-gray-100 rounded-t-xl w-full flex justify-center fixed bottom-0'>
            <div className='py-1'>
              made with{' '}
              <span role='img' aria-label='love'>
                💜
              </span>{' '}
              remotely
            </div>
          </div>
        </Router>
      </ErrorBoundary>
    </ApolloHooksProvider></ToastProvider>,
  document.getElementById('root'),
)
registerServiceWorker()
