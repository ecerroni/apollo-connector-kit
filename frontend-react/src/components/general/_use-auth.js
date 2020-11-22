import React from 'react'
import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import history from '../../history'
import { APP } from '../../apollo/_config'
import { currentUserQuery, loginMutation } from '../../api'
import { base64String } from '../../utils'

const { ROUTES: { LOGIN } = {} } = APP


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
    } else history.push(LOGIN)
    console.log('You have logged out')
  }
  const login = ({ email, username, password }, callback) => {
    submitLogin({
      variables: {
        userCredentials: {
          username: email || username,
          password: base64String(password),
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
