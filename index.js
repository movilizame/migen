#!/usr/bin/env node
var program = require('commander');
var lwip = require('lwip');
var chalk = require('chalk');
var path = require('path');
var sync = require('sync');

var schemas = {
    ios: [20,29,40,50,57,58,60,72,76,80,87,100,114,120,144,152,180,1024],
    android: [36,48,72,96,144,192]
};

var fnChangeImageSize = function (file, size) {
    var filename = path.basename(file);
    lwip.open(file, function(err, image) {
        if (err) {
            console.error(chalk.red('Error reading file: %s', err));
            return;
        }

        var newImageName = filename.replace('.png', '-' + size + '.png');

        image.batch().resize(size).writeFile(newImageName, function (err) {
            if (err) {
                console.error(chalk.red('Error writing file: %s', err));    
            } else {
                console.log('Created: %s', newImageName);
            }
        });

    });
    
};

var fnProcess = function (file) {
    if (file) {
        if (schemas[program.schema]) {
            var schema = schemas[program.schema];
            console.log('Generate %s images for: %s', program.schema, file);
            for (var index = 0; index < schema.length; index++) {
                sync(function () {
                    fnChangeImageSize(file, schema[index]);
                });
            }
            
        } else {
            console.error(chalk.red('Invalid schema'));
        }
    } else {
        console.error(chalk.red('Invalid file'));
    }
};


program
    .arguments('<file>')
    .option('-s, --schema <schema>', 'The pre-build schema to use: ios / android')
    .action(fnProcess)
    .parse(process.argv);