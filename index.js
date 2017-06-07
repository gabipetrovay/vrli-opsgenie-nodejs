var debug = require('debug')('shim:http');

var https = require('https');

var config = require('./config');
var opsgenie = require('./opsgenie');


https.createServer(config.https, (req, res) => {

    debug(req.method + ' ' + req.url);

    var body = '';

    req.on('data', (data) => {
        body += data.toString();
    });

    req.on('end', () => {

        debug('HTTP headers: ' + JSON.stringify(req.headers));

        if (!body) {
            return sendResponse(res, 400, 'The request payload must not be empty');
        }

        try {
            debug('HTTP body: ' + body);
            req.body = JSON.parse(body);
        } catch (err) {
            return sendResponse(res, 500, err);
        }

        if (req.method === 'POST') {
            postHandler(req, res);
            return;
        } else {
            putHandler(req, res);
            return;
        }
    });
}).listen(config.https, config.https.port);
debug('Listening on port: ' + config.https.port);

function postHandler (req, res) {
    var statusCode = 200;
    var vrliAlert = req.body;

    console.log('New vRLI alert: ' + vrliAlert.alertId + ' (' + vrliAlert.alertName + ')');

    opsgenie.createAlert(vrliAlert, (err, opsgenieAlert) => {
        if (err) { return sendResponse(res, err.httpStatusCode || 500, err.error || err); }
        console.log('OpsGenie alert ' + opsgenieAlert.alertId + ' created for vRLI alert ' + vrliAlert.alertId);
        return sendResponse(res, statusCode, opsgenieAlert);
    });
}

function sendResponse (res, statusCode, response) {
    if (typeof response === 'object') {
        if (response instanceof Error) {
            response = { error: response.toString() };
        }
        response = JSON.stringify(response);
    }
    debug(statusCode >= 300 ? 'Error:' : 'Response:', statusCode, response);
    res.writeHead(statusCode);
    res.end(response);
}
