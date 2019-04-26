import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css'
import { apolloClient } from './apollo'
import App from './App'
import { Login } from './components'
import { ErrorBoundary, ErrorPage } from './components/general'
import registerServiceWorker from './registerServiceWorker'
import history from './history'

ReactDOM.render(
  <ApolloHooksProvider client={apolloClient}>
    <ErrorBoundary>
      <Router history={history}>
        <div className="container">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" render={() => <Redirect to="/app" />} />
            <Route path="/app" component={App} />
            <Route exact path="/error-page/:error" component={ErrorPage} />
            <Route component={ErrorPage} />
          </Switch>
          <Alert stack={{ limit: 3 }} />
          <div className="footer">made with 💜 remotely</div>

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
  </ApolloHooksProvider>,
  document.getElementById('root'),
);
registerServiceWorker();
