import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { Home } from './components'
import { Authenticate } from './components/general'
import { storeQuery } from './api'

const withStoreQuery = graphql(storeQuery);

const App = ({ match }) => (
  <div className="main">
    <Authenticate>
      <Home match={match} />
    </Authenticate>
    <style jsx>{`
      *,
      *::after,
      *::before {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
      p {
        color: #444;
      }
      h1 {
        color: navy;
      }
    `}</style>
  </div>
);
App.propTypes = {
  match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};


export default withStoreQuery(App);
