var express = require('express');
var prom = require('prom-client');
const register = prom.register; //registro global de métricas, guarda todas as métricas no formato certo para o prometheus

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

 const histogram = new prom.Histogram({
  name: 'histogram_request_time_seconds',
  help: 'Tempo de resposta da API via Histograma',
  buckets: [0.1, 0.2, 0.3, 0.4, 0.5],
});

const summary = new prom.Summary({
  name: 'summary_request_time_seconds',
  help: 'Tempo de resposta da API via Summary',
  percentiles: [0.1, 0.5, 0.9, 0.99],
});

app.get('/', function(req, res) {
    counter.labels('200').inc(); // contador com label 200 que incrementa a cada requisição
    gauge.set(100*Math.random()); // simulando um gauge

    const tempoResposta = Math.random();
    histogram.observe(tempoResposta); // simulando um histograma
    summary.observe(tempoResposta) // simulando um summary

    res.send('Hello World!');

});

app.get('/metrics', async function(req, res){
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());

});

app.listen(3000);