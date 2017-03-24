var client = require("../lib/node-glances.js"),
    should = require("should");

describe('Client', function() {
    describe('#createClient()', function() {
        it('should return an error when initialized with wrong options', function() {
            client.createClient('i am a string').should.be.an.instanceof(Error);
            client.createClient(666).should.be.an.instanceof(Error);
            client.createClient(['i', 'am', 'an', 'array']).should.be.an.instanceof(Error);
        });
    });
});