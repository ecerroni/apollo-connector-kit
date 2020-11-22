import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/client'
import { ToastProvider } from 'react-toast-notifications'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { apolloClient } from './apollo'
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
            <div className='footer'>made with <span role='img' aria-label='love'>💜</span> remotely</div>
            <style jsx global>{`
            *,
            *::before,
            *::after {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html {
              height: 100%;
            }
            body {
              min-height: 100%;
              display: flex;
              font-family: Helvetica;
            }
            #root,
            .container {
              min-height: 100%;
              min-width: 100%;
              display: flex;
              flex: 1;

              flex-direction: column;
              flex-basis: 100%;
            }
            .footer {
              margin: 2em auto;
            }
          `}</style>
          </div>
        </Router>
      </ErrorBoundary>
    </ApolloHooksProvider></ToastProvider>,
  document.getElementById('root'),
)
registerServiceWorker()
