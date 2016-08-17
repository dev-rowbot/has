/* eslint no-undef: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */

var has = require('../index.js');

var settings = has.environment.default();
settings.os       = 'windows'; 
settings.hostname = '192.168.58.3'; 
settings.username = 'Vagrant'; 
settings.password = 'password'; 
settings.protocol = 'https'; 
has.environment(settings, 'DEBUG');
has.user('Vagrant')
    .then(function (result) {
        console.log(result);
        return has.user.who_belongs_to_group('Administrators');
    })
    .then(function (result) {
        console.log(result);
    });
