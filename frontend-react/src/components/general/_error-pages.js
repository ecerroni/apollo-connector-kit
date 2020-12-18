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
    <div className='container w-full flex justify-center items-center'>
      <div className='w-2/5 mt-4 py-16 bg-gray-100 rounded-md px-8'>
        <h1>
          We got a problem <small>Error {statusCode}</small>
        </h1>
        <p className='lead'>{content}</p>
        <p className='justify-center flex pt-8 text-purple-700'>
          <Link href='/' to='/'>
            Home
          </Link>
        </p>
      </div>
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
