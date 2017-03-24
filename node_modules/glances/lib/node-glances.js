var Client = require("./client");

/**
 * Creates a Glances client.
 *
 * @param {String} url - Glances server url to make the requests to
 *
 * @return {Client}
 */
exports.createClient = function(url) {
    return new Client(url);
}