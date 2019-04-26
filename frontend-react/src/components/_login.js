import React from 'react'
import { Form } from './form'
import { useAuth } from './general'

const Login = () => {
  const auth = useAuth();

  return (<div className="login-wrapper">
    <h1>Login</h1>
    <Form callback={(values) => auth.login({ ...values })} />
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

export default Login;