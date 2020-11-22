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

  return (<div className='login-wrapper'>
    <h1>Login</h1>
    <Form callback={(values) => auth.login({
      ...values,
    }, (e) => {
      if (e) {
        addToast('Wrong credentials', { appearance: 'error', autoDismiss: true })
      } else {
        setRedirect(true)
      }
    })} />
    <style jsx>{`
    .login-wrapper {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    };
    .login-form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    };
    .login-form > input {
      font-size: 1.5em;
      margin-top: 1em;
      border-radius: .45em;
      height: 3.5em;
      width: 20em;
      max-width: 300px;
      border: 1px solid silver;
      padding-left: .45em;
    }
    input:focus {
      outline: none;
      border-color: #719ECE;
      box-shadow: 0 0 10px #719ECE;
    }
    .submit-button {
      margin-top: 3.5em;
      background-color: steelblue;
      border-radius: 1.5em;
      width: 15em;
      max-width: 200px;
      height: 2em;display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .submit-button.disabled {
      background-color: silver;
      opacity: .5;
      pointer-events: none;
    }

    .submit-button > span {
      color: #fff;
    }
  `}</style>
  </div>)
}
const ToastLogin = () => <ToastProvider><Login /></ToastProvider>
export default ToastLogin
