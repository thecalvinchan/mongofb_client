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
            http.get('http://mongofb.herokuapp.com/testquery?api_key='+conf.api+'&query='+query, function (res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    process.stdout.write(data);
                }).on('end', function(data) {
                    process.stdout.write('\n');
                    rl.prompt();
                });
            }).on('error', function(e) {
                console.log(e.message);
            });
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
