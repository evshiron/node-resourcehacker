# node-resourcehacker

Just another Resource Hacker wrapper for node.js.

## Installation

```
$ npm install node-resourcehacker --save
```

During installation, the Resource Hacker binary will be automatically downloaded. I can't include a copy of Resource Hacker because it's illegal. Try setting `HTTP_PROXY` if you experience a slow download speed.

## Usage

```javascript

const resourceHacker = require('node-resourcehacker');

resourceHacker({
    operation: 'addoverwrite',
    input: 'nw.exe',
    output: 'nw.exe',
    resource: 'nw.ico',
    resourceType: 'ICONGROUP',
    resourceName: 'IDR_MAINFRAME'
}, (err) => {

    if(err) {
        return console.error(err);
    }

    console.log('Done.');

});

```

## License

MIT.
