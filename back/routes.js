var fs = require('fs');

module.exports = function(app, passport) {

    // Start Page
    app.get('/', function(req, res) {
        res.sendFile('index.html', {
            "root": "./front", 
        });
    });
};