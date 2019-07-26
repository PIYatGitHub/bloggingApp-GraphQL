require('babel-register');
require('@babel/polyfill/noConflict');
const server = require('../../src/sever').default;

module.exports = async () =>{
  global.testServer = await server.start({port: 4000})
};