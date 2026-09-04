const http = require('http');
const fs = require('fs');

const html = '<!DOCTYPE html><html><head><title>Multi-Stage</title></head><body><h1>Hello World from Docker multi-stage build</h1></body></html>';
fs.writeFileSync('/tmp/index.html', html);
console.log('Build artifact generated.');
