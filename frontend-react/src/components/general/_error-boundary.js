import React from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  // componentDidCatch(error, info) {
  componentDidCatch() {
    // Display fallback UI
    this.setState({ hasError: true })
    // You can also log the error to an error reporting service like Sentry/LogRocket
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className='error-container'>
          <h3>Oops, something went wrong!</h3>
          <p>
            Try to refresh this page or load{' '}
            <a href='/' onClick={() => window.location('/')}>
              Home
            </a>
          </p>
          <style jsx>{`
            .error-container {
              height: 100%;
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            h3,
            p {
              padding: 30px;
            }
          `}</style>
        </div>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}
