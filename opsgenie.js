var debug = require('debug')('shim:opsgenie');

var sdk = require('opsgenie-sdk');

var config = require('./config');


// build the OpsGenie configuration object
var opsgenieConfig = {
    api_key: config.opsgenie.apiKey,
};

// configure OpsGenie SDK
sdk.configure(opsgenieConfig);
debug('OpsGenie configuration: ' + JSON.stringify(sdk.configuration));

/**
 * Create an OpsGenie alert given a vRLI alert object.
 *
 * The vRLI alert ID will be saved as alias in OpsGenie.
 */
exports.createAlert = function (vrliAlert, callback) {
    debug('vRLI alert:', JSON.stringify(vrliAlert));

    var opsgenieAlert = {
        // only test alerts should have no name and hence creating a test alert
        message: vrliAlert.alertName || 'Test alert',
        description: vrliAlert.info,
        alias: vrliAlert.alertId
    };

    sdk.alert.create(opsgenieAlert, buildOptions(), (err, alert) => {
        if (err) { return callback(err); }
        debug('OpsGenie created alert: ', JSON.stringify(alert));
        return callback(null, alert);
    });
};

/**
 * Cancel an OpsGenie alert given a vRLI alert object.
 *
 * This will search the OpsGenie alert with the alias equal to the vRLI alert ID.
 */
exports.cancelAlert = function (vrliAlert, callback) {
    debug('vRLI alert:', JSON.stringify(vrliAlert));

    sdk.alert.get({ alias: vrliAlert.alertId }, buildOptions(), function (err, alert) {
        if (err) { return callback(err); }

        sdk.alert.close({ alias: vrliAlert.alertId }, buildOptions(), function (err, result) {
            if (err) { return callback(err); }
            debug('OpsGenie canceled alert: ' + JSON.stringify(alert));
            return callback(null, alert);
        });
    });
};

function buildOptions () {
    var options = {
        strictSSL: false
    };
    if (process.env.http_proxy) {
        debug('Detected http_proxy: ' + process.env.http_proxy);
        options.proxy = 'http://' + process.env.http_proxy;
    }
    debug('Using the following OpsGenie request options: ' + JSON.stringify(options));
    return options;
}
