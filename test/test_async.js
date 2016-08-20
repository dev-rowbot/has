/* eslint no-undef: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */

var has_module = require('../index.js');

has = [];
has[0] = new has_module();
has[1] = new has_module();

var settings = has[0].environment.default();
settings.os       = 'windows';
settings.hostname = '192.168.58.3';
settings.username = 'Vagrant';
settings.password = 'vagrant';
settings.protocol = 'http';
has[0].environment(settings, 'INFO');

has[0].file('c:\\test').then(function (result) {
    console.log("========================");
    console.log(result);
    return has[0].file.with_version('c:\\ProgramData\\chocolatey\\choco.exe', '0.9.9.12');
})
.then(function (result) {
    console.log("========================");
    console.log(result);
});

var settings = has[1].environment.default();
settings.os       = 'windows';
settings.hostname = '192.168.58.4';
settings.username = 'Vagrant';
settings.password = 'vagrant';
settings.protocol = 'http';
has[1].environment(settings, 'INFO');

has[1].file('c:\\test').then(function (result) {
    console.log("========================");
    console.log(result);
    return has[1].file.with_version('c:\\ProgramData\\chocolatey\\choco.exe', '0.9.9.12');
})
.then(function (result) {
    console.log("========================");
    console.log(result);
});

