//npm deps
const websocket = require('websocket-stream');

//app deps

function buildBuilder(client, opts) {
   return websocket(opts.url, ['mqttv3.1'], opts.websocketOptions);
}

module.exports = buildBuilder;
