import React from 'react'
import PropTypes from 'prop-types'
import { useToasts } from 'react-toast-notifications'
import { Home } from './components'
import { Authenticate } from './components/general'
import history from './history'

import './index.css'


const App = ({ match, location }) => {
  const { state } = location
  const { addToast } = useToasts()
  React.useEffect(() => {
    if (state && state.welcome) {
      addToast('Welcome!', { appearance: 'success', autoDismiss: true })
      history.replace('/') // that's an hack to remove route's state
    }
  }, [])
  return (
    <div className='main'>
      <Authenticate>
        <Home match={match} />
      </Authenticate>
    </div>
  )
}
App.propTypes = {
  match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
}


export default App
