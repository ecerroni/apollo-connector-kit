import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const errorPage = code => {
  const errorCode = code.substr(0, 3)
  const errorFamily = code.substr(0, 2)
  const errorObj = {
    statusCode: errorCode,
    content: 'Something went wrong',
  }
  switch (errorFamily) {
    case '40':
      if (errorCode === '403') {
        errorObj.content = `The requested resource is Forbidden`
      } else {
        errorObj.content = `The requested resource could not be found but may be available again in the future.`
      }
      break
    case '50':
      errorObj.content = `An unexpected condition was encountered. Our service team has been dispatched to bring it back online.`
      break
    default:
      break
  }
  return errorObj
}

const Page = ({ match: { params: { error = '404' } } }) => {
  const { statusCode, content } = errorPage(error)
  return (
    <div className='cover'>
      <h1>
        We got a problem <small>Error {statusCode}</small>
      </h1>
      <p className='lead'>{content}</p>
      <p>
        <Link href='/' to='/'>
          Home
        </Link>
      </p>
      <style jsx>{`
        .cover {
          background-color: steelblue;
          padding: 50px 50px;
          color: #eee;
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: center;
          align-items: center;
        }
        .lead {
          font-size: large;
        }
      `}</style>
    </div>
  )
}

Page.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      error: PropTypes.string,
    }),
  }),
}

Page.defaultProps = {
  match: {
    params: {
      error: '404',
    },
  },
}

export default Page
