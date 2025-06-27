var express = require('express');
var prom = require('prom-client');
const register = prom.register;

var app = express();



app.get('/', function(req, res) {
    counter.labels('200').inc();

    res.send('Hello World!');

});

app.get('/metrics', async function(req, res){
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());

});

app.listen(3000);