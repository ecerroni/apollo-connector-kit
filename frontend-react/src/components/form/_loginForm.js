import React from 'react'
import useForm from 'react-hook-form'

const LoginForm = ({ callback = () => { }, forgotPassword = false }) => {
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = data => {
    callback(data)
  }

  return (<div className='w-full max-w-xs'>
    <form onSubmit={handleSubmit(onSubmit)} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <div className='mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
          Username
        </label>
        <input
          className='shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          id='username'
          name='username'
          type='text'
          placeholder='Username'
          ref={register({ required: true })} />

        <p className='text-red-500 text-xs italic h-2'>{errors.username && 'Please choose a username.'}</p>
      </div>
      <div className='mb-6'>
        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
          Password
        </label>
        <input
          className={`shadow appearance-none border ${errors.password ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
          id='password'
          name='password'
          type='password'
          placeholder='******************'
          ref={register({ required: true })} />
        <p className='text-red-500 text-xs italic h-2'>{errors.password && 'Please choose a password.'}</p>
      </div>
      <div className='flex items-center justify-between'>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='submit'
          onClick={() => handleSubmit(onSubmit)}
        >
          Sign In
        </button>
        {forgotPassword && <div className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'>
          Forgot Password?
        </div>}
      </div>
    </form>
  </div>)
}

export default LoginForm
