require('dotenv').config()

const lookenv = require('lookenv')
const path = require('path')                                                      
const Dotenv = require('dotenv-webpack') 

module.exports = {                                                                
  webpack: async (config) => {
    const { config: lookEnvConfig } = await lookenv.config({ path: './env/lookenv.dev.js' })
    let defaultEnvs = Object.entries(lookEnvConfig).reduce((obj, entry) => {
      if (entry[1].default) {
        return { ...obj, [`${entry[0]}`]: entry[1].default}
      }
      return { ...obj }
    }, {})                                                
    config.plugins = config.plugins || []                                         

    config.plugins = [                                                            
     ...config.plugins,                                                          

     // Read the .env file                                                       
     new Dotenv({                                                                
          path: path.join(__dirname, './env/.env'),                                       
          systemvars: true                                                          
        })                                                            
    ]
    let allEnvs = config.plugins.filter(p => p['definitions'] && Object.entries(p['definitions']).filter(entry => entry[0].includes('process.env')));
    const additionalEnvs = {};
    Object.keys(defaultEnvs).forEach(key => {
      if (!allEnvs.includes(`process.env.${key}`)) additionalEnvs[key] = defaultEnvs[key]
    });
    if (additionalEnvs.length > 0) {
      config.plugins[config.plugins.length - 1].definitions = { ...config.plugins[config.plugins.length - 1].definitions, ...additionalEnvs }
    }
    return config                                                                 
  }                                                                               
}                                                