/* eslint no-undef: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */

var has = require('../index.js')();

var settings = has.environment.default();
settings.os       = 'windows';
settings.hostname = '192.168.58.3';
settings.username = 'Vagrant';
settings.password = 'vagrant';
settings.protocol = 'http';
has.environment(settings, 'DEBUG');

has.file('c:\\test').then(function (result) {
    console.log("========================");
    console.log(result);
    return has.file.with_version('c:\\ProgramData\\chocolatey\\choco.exe', '0.9.9.12');
})
.then(function (result) {
    console.log("========================");
    console.log(result);
});

has.service.installed('filebeat').then(function (result) {
    console.log("========================");
    console.log(result);
    return has.service.running('filebeat');
})
.then(function (result) {
    console.log("========================");
    console.log(result);
    return has.service.with_start_mode('filebeat', 'auto');
})
.then(function (result) {
    console.log("========================");
    console.log(result);
});

