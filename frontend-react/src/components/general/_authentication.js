import { useQuery } from '@apollo/client'
import React, { Suspense } from 'react'
import { AUTH_QUERY } from '../../api'
import Loading from './_loading'

const ConnectionResult = ({ children }) => {
  useQuery(AUTH_QUERY, {
    suspend: true,
    options: { fetchPolicy: 'network-only' },
  })
  return children
}

const Authenticate = (props) => <Suspense fallback={<Loading />}>
  <ConnectionResult {...props} />
</Suspense>

export default Authenticate
