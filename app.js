var express     = require('express'),
    app         = express(),
    compress    = require('compression'),
    server      = require('http').createServer(app),
    bodyParser  = require('body-parser'),
    config      = require('./config'),
    router      = require('./router');

server.listen(config.server.port, function () {
    console.info('Splinter listening on port: ' + config.server.port);
});

/* Support gzip responses */
app.use(compress());

app.use(express.static(__dirname + '/views'));

/* Support json encoded bodies */
app.use(bodyParser.json());
/* Support encoded bodies */
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', router);

module.exports = app;