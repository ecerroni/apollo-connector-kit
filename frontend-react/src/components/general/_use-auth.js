import React from 'react'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import history from '../../history'
import { currentUserQuery, loginMutation } from '../../api'
import hash from 'hash.js'

const hashString = text => ({
  digest: hash
    .sha256()
    .update(text)
    .digest('hex'),
  algorithm: 'sha-256',
})

const isFunction = (functionToCheck) => functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'

const useAuth = () => {
  const { data: { currentUser } = {}, loading } = useQuery(currentUserQuery)
  const [submitLogin] = useMutation(loginMutation)
  const client = useApolloClient()
  if (loading) return <p>Loading...</p>
  const logout = (callback, { cacheOnly = false } = {}) => {
    if (cacheOnly) {
      client.clearStore()
    } else {
      client.resetStore()
    }
    if (callback && isFunction(callback)) {
      callback(null, 'success')
    } else history.push('/login')
    console.log('You have logged out')
  }
  const login = ({ email, username, password }, callback) => {
    submitLogin({
      variables: {
        userCredentials: {
          username: email || username,
          password: hashString(password).digest,
        },
      },
    }).then((res) => {
      if (!!callback && isFunction(callback)) {
        callback(null, res)
      } else history.push('/')
      console.log('Login successful')
    }).catch(e => {
      // notify error
      // console.log(e)
      if (!!callback && isFunction(callback)) callback(e)
    })
  }
  return {
    user: currentUser,
    loading,
    login,
    logout,
    isLoggedIn: !!currentUser && !!Object.keys(currentUser).length,
  }
}

export default useAuth
