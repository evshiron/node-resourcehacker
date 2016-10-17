# node-resourcehacker

Just another Resource Hacker wrapper for node.js.

## Installation

```
$ npm install node-resourcehacker --save
```

During the first usage, the Resource Hacker binary will be automatically downloaded. I can't include a copy of Resource Hacker because it's illegal. Try setting `HTTP_PROXY` if you experience a slow download speed.

By specifying environment variable `SOURCE_RESOURCE_HACKER`, we are able to download Resource Hacker from somewhere else, or use a local archive instead.

## Usage

```javascript

const resourceHacker = require('node-resourcehacker');

// Use the beta release of Resource Hacker.
process.env['SOURCE_RESOURCE_HACKER'] = 'http://www.angusj.com/resourcehacker/resource_hacker_beta.zip';

// Use a local Resource Hacker archive.
process.env['SOURCE_RESOURCE_HACKER'] = '~/Downloads/resource_hacker.zip';

resourceHacker({
    operation: 'addoverwrite',
    input: 'nw.exe',
    output: 'nw.exe',
    resource: 'nw.ico',
    resourceType: 'ICONGROUP',
    resourceName: 'IDR_MAINFRAME',
}, (err) => {

    if(err) {
        return console.error(err);
    }

    console.log('Done.');

});

```

## License

MIT.
