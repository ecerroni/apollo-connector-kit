import React from 'react'
import { compose, withHandlers, withState } from 'recompose'
import { graphql } from 'react-apollo'
import Alert from 'react-s-alert'
import history from '../history'
import { loginMutation } from '../api'
import { hashString } from '../utils'

const withLoginMutation = graphql(loginMutation);

const recomposeStates = compose(
  withState('username', 'setUsername', ''),
  withState('password', 'setPassword', ''),
);

const recomposeHandlers = withHandlers({
  submitLogin: ({mutate, username, password}) => () => {
    mutate({
      variables: {
        userCredentials: {
          username,
          password: hashString(password).digest,
        }
      },
    }).then(() => {
      history.push('/');
      Alert.success('Login successful', {
        position: 'top',
        effect: 'stackslide',
        timeout: 1500,
      });
    }).catch(e => Alert.error('The username/password combination is wrong', { position: 'bottom' }));
  },
});

const Login = ({ username, setUsername, password, setPassword, submitLogin }) =>
  <div className="login-wrapper">
    <h1>Login</h1>
    <form className="login-form">
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={e => setUsername(e.target.value) }
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)
        }/>
    </form>
    <div className={`submit-button ${username === '' || password === '' ? 'disabled' : ''}`} onClick={() => submitLogin()}>
      <span>Submit</span>
    </div>
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
  </div>

export default compose(
  withLoginMutation,
  recomposeStates,
  recomposeHandlers,
)(Login);