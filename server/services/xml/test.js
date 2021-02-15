const { serializeMethodCall } = require('xmlrpc/lib/serializer');

console.log(serializeMethodCall('anotherMethod', [{ test: 123 }]));
