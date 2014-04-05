var fs = require('fs');
var http = require('http');
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
            
        process.stdin.on('data', function (query) {
            if (query === 'quit\n') {
                done();
            }
            http.get('http://mongofb.herokuapp.com/testquery?api_key='+conf.api+'&query='+query.slice(0,-1), function (res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    process.stdout.write(data);
                }).on('end', function(data) {
                    process.stdout.write('\n> ');
                });
            }).on('error', function(e) {
                console.log(e.message);
            });
        });
    }
});

function done() {
    console.log('Now that process.stdin is paused, there is nothing more to do.');
    process.exit();
};
