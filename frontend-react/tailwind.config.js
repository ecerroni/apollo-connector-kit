module.exports = {
  purge: {
    content: ['./src/**/*.html', './src/**/*.js'],
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
}
