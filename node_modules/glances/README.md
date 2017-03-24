node-glances [![Build Status](https://travis-ci.org/Pegase745/node-glances.png?branch=master)](https://travis-ci.org/Pegase745/node-glances) [![NPM version](https://badge.fury.io/js/glances.png)](http://badge.fury.io/js/glances)
============

Nicolargo's [Glances] (https://github.com/nicolargo/glances) client for Node.js available on [NPM] (https://npmjs.org/package/glances)

## Requirements
* `Node.js >= 0.8`
* `Glances server <= 1.7`

## Installation

    npm install glances
    
## Usage

```javascript
var glances = require('node-glances');

var client = glances.createClient({ host: 'your-url' });

client.call('api-method(ie: getAll)', function(error, value){
    if(error) {
        console.log(error.faultString);
    } else {
        console.dir(value);
    }
});
```

## Documentation
All available API methods for Glances are available [here] (https://github.com/nicolargo/glances/blob/master/docs/glances-doc.rst).

## License
Copyright (c) 2013 Michel Nemnom

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
