
'use strict';

var path = require('path');
var fs = require('fs');
var childProcess = require('child_process');
var util = require('util');

var nugget = require('nugget');

var DecompressZip = require('decompress-zip');

var posixNormalize = require('./path').posixNormalize;

var DIR_ROOT = path.dirname(path.dirname(module.filename));
var PATH_RESOURCE_HACKER_ZIP = path.join(DIR_ROOT, 'resource_hacker.zip');
var PATH_RESOURCE_HACKER_EXE = path.join(DIR_ROOT, 'ResourceHacker.exe');

function extractZip(path, destination, callback) {

    var unzip = new DecompressZip(path);
    unzip.on('error', function(err) { return callback(err); })
    .on('extract', function() { callback(null, destination); })
    .extract({
        path: destination,
    });

}

function normalize(p) {

    return posixNormalize(p.replace(/\\+/g, '/'));

}

function exec(options, callback) {

    if(!options) {
        return process.nextTick(function() { callback(new Error('ERROR_NO_OPTIONS')); });
    }

    if(!options.operation) {
        return process.nextTick(function() { callback(new Error('ERROR_NO_OPERATION')); });
    }

    if(!options.input) {
        return process.nextTick(function() { callback(new Error('ERROR_NO_INPUT')); });
    }

    if(!options.output) {
        return process.nextTick(function() { callback(new Error('ERROR_NO_OUTPUT')); });
    }

    if(!options.resource) {
        return process.nextTick(function() { callback(new Error('ERROR_NO_RESOURCE')); });
    }

    if(!options.resourceType) {
        return process.nextTick(function() { callback(new Error('ERROR_NO_RESOURCE_TYPE')); });
    }

    if(!options.resourceName) {
        return process.nextTick(function() { callback(new Error('ERROR_NO_RESOURCE_NAME')); });
    }

    var args = [PATH_RESOURCE_HACKER_EXE];

    switch(options.operation) {
    case 'add':
        args.push('-add',
            util.format('%s,', normalize(options.input)),
            util.format('%s,', normalize(options.output)),
            util.format('%s,', normalize(options.resource)),
            util.format('%s,', options.resourceType),
            util.format('%s,', options.resourceName)
        );
        break;
    case 'addskip':
        args.push('-addskip',
            util.format('%s,', normalize(options.input)),
            util.format('%s,', normalize(options.output)),
            util.format('%s,', normalize(options.resource)),
            util.format('%s,', options.resourceType),
            util.format('%s,', options.resourceName)
        );
        break;
    case 'addoverwrite':
        args.push('-addoverwrite',
            util.format('%s,', normalize(options.input)),
            util.format('%s,', normalize(options.output)),
            util.format('%s,', normalize(options.resource)),
            util.format('%s,', options.resourceType),
            util.format('%s,', options.resourceName)
        );
        break;
    case 'modify':
        args.push('-modify',
            util.format('%s,', normalize(options.input)),
            util.format('%s,', normalize(options.output)),
            util.format('%s,', normalize(options.resource)),
            util.format('%s,', options.resourceType),
            util.format('%s,', options.resourceName)
        );
        break;
    case 'extract':
        args.push('-extract',
            util.format('%s,', normalize(options.input)),
            util.format('%s,', normalize(options.resource)),
            util.format('%s,', options.resourceType),
            util.format('%s,', options.resourceName)
        );
        break;
    case 'delete':
        args.push('-delete',
            util.format('%s,', normalize(options.input)),
            util.format('%s,', normalize(options.output)),
            util.format('%s,', options.resourceType),
            util.format('%s,', options.resourceName)
        );
        break;
    default:
        return process.nextTick(function() { callback(new Error('ERROR_OPERATION_NOT_SUPPORTED')); });
    }

    if(process.platform != 'win32') {
        args.unshift('wine');
    }

    var child = childProcess.exec(args.join(' '), {}, function(err, stdout, stderr) {

        if(err) {
            return callback(err);
        }

        callback(null);

    });

}

function extractAndExec(path, options, callback) {

    extractZip(path, DIR_ROOT, function(err) {

        if (err) {
            callback(err);
        }

        exec(options, callback);

    });

}

function Exec(options, callback) {

    var source = process.env['SOURCE_RESOURCE_HACKER'] ? process.env['SOURCE_RESOURCE_HACKER'] : 'http://www.angusj.com/resourcehacker/resource_hacker.zip';

    fs.exists(PATH_RESOURCE_HACKER_EXE, function(exists) {

        if(exists) {
            return exec(options, callback);
        }

        if (source.indexOf('http') == -1) {

            fs.exists(source, function(exists) {

                if(!exists) {
                    return callback(new Error('ERROR_ARCHIVE_NOT_EXISTS'));
                }

                extractAndExec(source, options, callback);

            });

        }
        else {

            nugget(source, {
                target: PATH_RESOURCE_HACKER_ZIP,
            }, function(err) {

                if(err) {
                    return callback(err);
                }

                extractAndExec(PATH_RESOURCE_HACKER_ZIP, options, callback);

            });

        }

    });

}

module.exports = Exec;
