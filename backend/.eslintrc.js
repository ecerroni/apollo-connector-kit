// http://eslint.org/docs/user-guide/configuring


module.exports = {
  "root": true,
  "extends": "airbnb-base",
  "settings": {
    "import/resolver": {
      "babel-plugin-root-import": {}
    }
  },
  "plugins": [
    "import",
  ]
};
