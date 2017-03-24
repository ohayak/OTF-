var util    = require("util"),
    xmlrpc  = require("xmlrpc");

/**
 * Creates a Client object for making XML-RPC calls to Glances server.
 *
 * @constructor
 * @param {String} url - Server options to make the HTTP request to.
 *                       Either a URI string (e.g. 'http://localhost:61209')
 *
 * @return {Client}
 */
function Client(options) {
    // Is it an object?
    if(typeof options != "object") {
        return new Error(options + " is not an object.");
    }

    // Is it an object with the correct format?
    if(!options.host) {
        return new Error(options + " must at least have a host parameter.");
    }

    // Sets default path on which Glances serves the XMLRPC server
    if (!options.path) options.path = "/RPC2";
    
    // Sets default port on which Glances serves the XMLRPC server
    if (!options.port) options.port = 61209;

    this.client = xmlrpc.createClient(options);

    return this;
}

Client.prototype.call = function(method, callback) {
    this.client.methodCall(method, [], callback);
}

module.exports = Client