import '@babel/polyfill/noConflict'
import server from './server'
server.start({port:process.env.PORT || 4000}, ()=>console.log('the server is up on port 4000'));