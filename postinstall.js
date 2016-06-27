
'use strict';

var path = require('path');
var fs = require('fs');

var nugget = require('nugget');

var DecompressZip = require('decompress-zip');

var DIR_ROOT = path.dirname(module.filename);
var PATH_RESOURCE_HACKER_ZIP = path.join(DIR_ROOT, 'resource_hacker.zip');
var PATH_RESOURCE_HACKER_EXE = path.join(DIR_ROOT, 'ResourceHacker.exe');

function ExtractZip(path, destination, callback) {

    const unzip = new DecompressZip(path);
    unzip.on('error', function(err) { return callback(err); })
    .on('extract', function() { callback(null, destination); })
    .extract({
        path: destination,
    });

}

nugget('http://www.angusj.com/resourcehacker/resource_hacker.zip', {
    target: PATH_RESOURCE_HACKER_ZIP,
    resume: true
}, function(err) {

    if(err) {
        throw err;
    }

    ExtractZip(PATH_RESOURCE_HACKER_ZIP, DIR_ROOT, function(err, destination) {

        if(err) {
            throw err;
        }

        console.log('Download succeeded.');

    });

});

