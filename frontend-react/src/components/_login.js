import React from 'react'
import { ToastProvider, useToasts } from 'react-toast-notifications'
import { Redirect } from 'react-router-dom'
import { LoginForm as Form } from './form'
import { useAuth } from './general'

const Login = () => {
  const { addToast } = useToasts()
  const auth = useAuth()
  const [redirect, setRedirect] = React.useState(false)

  if (redirect) {
    return <Redirect to={{
      pathname: '/app',
      state: {
        welcome: true,
      },
    }} />
  }

  return (<div className='container flex flex-wrap justify-center items-center'>
    <div className='w-full py-8 flex justify-center items-center'>
      <span className='text-xl'>Login</span>
    </div>
    <Form callback={(values) => auth.login({
      ...values,
    }, (e) => {
      if (e) {
        addToast('Wrong credentials', { appearance: 'error', autoDismiss: true })
      } else {
        setRedirect(true)
      }
    })} />
  </div>)
}
const ToastLogin = () => <ToastProvider><Login /></ToastProvider>
export default ToastLogin
