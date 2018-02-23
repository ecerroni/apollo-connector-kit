import React, { Component } from 'react';
import { compose, withState, withHandlers } from 'recompose';

const enhance = compose(
  withState('value', 'updateValue', ''),
  withState('msg', 'updateMsg', ''),
  withHandlers({
    onChange: props => event => {
      props.updateValue(event.target.value);
      props.updateMsg(event.target.value);
    },
    onSubmit: props => event => {
      event.preventDefault()
      console.log(props.value);
    }
  })
);
const Form = enhance(({ value, msg, onChange, onSubmit }) =>
  <form onSubmit={onSubmit}>
    <label>Is recompose working?
      <input type="text" value={value} onChange={onChange} />
    </label>
    <h3>{msg ? `Recompose is working: ${msg}` : null}</h3>
  </form>
)


class App extends Component {
  componentDidMount() {
    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ publicTest }' }),
    })
      .then(res => res.json())
      .then(res => console.log('APOLLO CONNECTION:', res.data.publicTest))
      .catch(() => console.warn('APOLLO CONNECTION ERROR: '));
  }
  render() {
    return (
      <div>
        <header>
          <h1>Welcome to React</h1>
        </header>
        <p>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Form />


      <style jsx>{`
        p {
          color: #444;
        }
        h1 {
          color: navy;
        }
      `}</style>

      </div>
    );
  }
}

export default App;
