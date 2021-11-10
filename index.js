#!/usr/bin/env node
var jimp = require('jimp');
var program = require('commander');
// var lwip = require('pajk-lwip');
var chalk = require('chalk');
var path = require('path');
var sync = require('sync');
var sizeOf = require('image-size');

var schemas = {
    'ios': [
        20, 29, 40, 48, 50, 55, 57, 58, 60, 72, 76, 80, 87, 88, 100, 114, 120, 144, 152, 167, 172, 180, 196, 1024
    ],
    'android': [ 
        36, 48, 72, 96, 144, 192 
    ],
    'ios-screen': [
        /* 
        1334x1334 	Default@2x~iphone~anyany.png
        750x1334 	Default@2x~iphone~comany.png
        1334x750 	Default@2x~iphone~comcom.png
        2208x2208 	Default@3x~iphone~anyany.png
        2208x1242 	Default@3x~iphone~anycom.png
        1242x2208 	Default@3x~iphone~comany.png
        2732x2732 	Default@2x~ipad~anyany.png
        1278x2732 	Default@2x~ipad~comany.png
        */
       { w: 1334,  h: 1334, name: 'Default@2x~iphone~anyany.png'  },
       { w: 750,   h: 1334, name: 'Default@2x~iphone~comany.png'  },
       { w: 1334,  h: 750,  name: 'Default@2x~iphone~comcom.png'  },
       { w: 2208,  h: 2208, name: 'Default@3x~iphone~anyany.png'  },
       { w: 2208,  h: 1242, name: 'Default@3x~iphone~anycom.png'  },
       { w: 1242,  h: 2208, name: 'Default@3x~iphone~comany.png'  },
       { w: 2732,  h: 2732, name: 'Default@2x~ipad~anyany.png'  },
       { w: 1278,  h: 2732, name: 'Default@2x~ipad~comany.png'  },
        /* { w: 320,  h: 480  },
        { w: 640,  h: 960  },
        { w: 640,  h: 1136 },
        { w: 750,  h: 1334 },
        { w: 768,  h: 1024 },
        { w: 1024, h: 768  },
        { w: 1242, h: 2208 },
        { w: 1536, h: 2048 },
        { w: 2208, h: 1242 },
        { w: 2048, h: 1536 },
        { w: 1125, h: 2436 },
        { w: 2436, h: 1125 }, */
    ],
    'android-screen': [
        { w: 200,  h: 320  }, // ldpi
        { w: 320,  h: 200  },
        { w: 320,  h: 480  }, // mdpi
        { w: 480,  h: 320  },
        { w: 480,  h: 800  }, // hdpi
        { w: 800,  h: 480  },
        { w: 720,  h: 1280 }, // xhdpi
        { w: 1280, h: 720  },
        { w: 960,  h: 1600 }, // xxhdpi
        { w: 1600, h: 960  },
        { w: 1280, h: 1920 }, // xxxhdpi
        { w: 1920, h: 1280 }
    ]
};

var fnChangeImageSize = function (file, size) {
    var filename = path.basename(file);
    jimp.read(filename).then(function (image) {
        var newImageName = '';
        if (typeof size === 'object') {
            var dimensions = sizeOf(file);
            if (size.name) {
                newImageName = size.name;
            } else {
                newImageName = filename.replace('.png', '-' + size.w + 'x' + size.h + '.png');
            }
            var cos = Math.floor(dimensions.width / (size.w > size.h ? size.w : size.h));
            var width = parseInt(size.w * cos, 10);
            var height = parseInt(size.h * cos, 10);
            var startCropX = dimensions.width / 2 - width / 2;
            var startCropY = dimensions.height / 2 - height / 2;
            image
                .crop(startCropX, startCropY, width, height)
                .resize(size.w, size.h, jimp.RESIZE_BEZIER)
                .write(newImageName);

        } else {
            newImageName = filename.replace('.png', '-' + size + '.png');
            var intSize = parseInt(size, 10);
            if (!isNaN(intSize)) {
                image
                    .resize(intSize, intSize, jimp.RESIZE_BEZIER)
                    .write(newImageName);
            }
        }
    }).catch(function (err) {
        console.error(err);
    });
    /* lwip.open(file, function(err, image) {
        if (err) {
            console.error(chalk.red('Error reading file: %s', err));
            return;
        }
        var newImageName = '';
        if (typeof size === 'object') {
            var dimensions = sizeOf(file);
            newImageName = filename.replace('.png', '-' + size.w + 'x' + size.h + '.png');
            var cos = Math.floor(dimensions.width / (size.w > size.h ? size.w : size.h));
            var width = size.w * cos;
            var height = size.h * cos;
            image.batch()
                 .crop(width, height)
                 .resize(size.w, size.h)
                 .writeFile(newImageName, function (err) {
                    if (err) {
                        console.error(chalk.red('Error writing file: %s', err));    
                    } else {
                        console.log('Created: %s', newImageName);
                    }
                });

        } else {
            newImageName = filename.replace('.png', '-' + size + '.png');
            var intSize = parseInt(size, 10);
            if (!isNaN(intSize)) {
                image.batch().resize(size).writeFile(newImageName, function (err) {
                    if (err) {
                        console.error(chalk.red('Error writing file: %s', err));    
                    } else {
                        console.log('Created: %s', newImageName);
                    }
                });
            }
        }
    }); */
    
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