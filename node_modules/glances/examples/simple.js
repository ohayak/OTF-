var glances = require('../lib/node-glances.js');

var client = glances.createClient({ host: 'your-url' });

client.call('getAll', function(error, value){
    if(error) {
        console.log(error.faultString);
    } else {
        console.dir(value);
    }
});