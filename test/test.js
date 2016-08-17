/* eslint no-undef: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */

var has = require('../index.js');

var settings = has.environment.default();
settings.os       = 'windows'; 
settings.hostname = '192.168.58.3'; 
settings.username = 'Vagrant'; 
settings.password = 'vagrant'; 
settings.protocol = 'http'; 
has.environment(settings, 'INFO');
has.file('c:\\test').then(function (result) {
        console.log("========================");
        console.log(result);
        return has.file.which_is_a_directory('c:\\vagranty');
    })
    .then(function (result) {
        console.log("========================");
        console.log(result);
    });
