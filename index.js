var express = require('express');
var prom = require('prom-client');
const register = prom.register;

var app = express();

const counter = new prom.Counter({
  name: 'request_total',
  help: 'Contador de requests',
  labelNames: ['statusCode']
});

const gauge = new prom.Gauge({ 
    name: 'free_bytes', 
    help: 'Gauge example'
 });

app.get('/', function(req, res) {
    counter.labels('200').inc();
    gauge.set(100*Math.random());

    res.send('Hello World!');

});

app.get('/metrics', async function(req, res){
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());

});

app.listen(3000);