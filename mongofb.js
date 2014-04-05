#!/usr/bin/env node

var fs = require('fs');
var http = require('http');
var readline = require('readline');
var util = require('util');
var config = 'config.json';

fs.readFile(config, 'utf8', function(err, data) {
    if (err) {
        console.log('Configuration error: Please check config.json');
    } else {
        var conf = JSON.parse(data);
        process.stdin.resume();
        process.stdout.write('> ');
        process.stdin.setEncoding('utf8');

        rl = readline.createInterface(process.stdin, process.stdout);
        rl.setPrompt('MongoFB> ');
        rl.prompt();

        rl.on('line', function(line) {
            var query = line.trim(); 
            if (query === 'quit') {
                done();
            }
            var options = {
                hostname: 'mongofb.herokuapp.com',
                path: '/api/v1?api_key='+conf.api+'&query='+query,
                method: 'GET'
            };
            var req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    process.stdout.write(data);
                }).on('end', function(data) {
                    process.stdout.write('\n');
                    rl.prompt();
                });
            });

            req.on('error', function(e) {
                console.log(e.message);
            });

            req.end();

        }).on('close', function() {
            console.log('Terminated');
            process.exit();
        });
    }
});

function done() {
    console.log('Terminated');
    process.exit();
};
