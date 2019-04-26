import React from 'react';
import useForm from "./_use-form";

const Form = ({ callback }) => {
  const { values, handleChange, handleSubmit } = useForm(login);

  function login() {
    callback(values);
  }
  // TODO: style the form
  return (
    <div className="section is-fullheight">
      <div className="container">
        <div className="column is-4 is-offset-4">
          <div className="box">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Email Address</label>
                <div className="control">
                  <input className="input" name="email" onChange={handleChange} value={values.email} required />
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input className="input" type="password" name="password" onChange={handleChange} value={values.password} required />
                </div>
              </div>
              <button type="submit" className="button is-block is-info is-fullwidth">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;