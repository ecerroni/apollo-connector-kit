const express = require('express')
const next = require('next')
const cors = require('cors');
    
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
    
const originWhitelist = [
  // Allow domains here
  '*',
];

const corsOptions = {
  origin(origin, callback) {
    const originIsWhitelisted = originWhitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  exposedHeaders: 'x-connector-token, x-connector-refresh-token',
  credentials: false, // Set true if response to preflight request doesn't pass access control check
};

app.prepare()
.then(() => {
  const server = express()
  server.use(cors(corsOptions))
  server.get('*', (req, res) => {
    console.log(Object.keys(req.res._headers));
    console.log('token', res._headers['x-connector-token']);
    // console.log('token', res.getHeader('x-connector-token'));
    return handle(req, res)
  })
    
  server.listen(3001, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3001')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})