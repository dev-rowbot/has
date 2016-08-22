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

has.file.with_version('c:\\ProgramData\\chocolatey\\choco.exe', '0.9.9.12').then(function (result) {
    console.log(result);
    console.log("========================");
    return has.file.with_version('c:\\ProgramData\\chocolatey\\choco.exe', '0.9.9.12');
})
.then(function (result) {
    console.log(result);
    console.log("========================");
    return has.file.which_is_a_directory('c:\\ProgramData\\chocolatey\\');
})
.then(function (result) {
    console.log(result);
    console.log("========================");
})
.catch (function (result) {
    console.log (result);
});

has.service.installed('filebeat').then(function (result) {
    console.log(result);
    console.log("========================");
    return has.service.running('filebeat');
})
.then(function (result) {
    console.log(result);
    console.log("========================");
    return has.service.with_start_mode('filebeat', 'auto');
})
.then(function (result) {
    console.log(result);
    console.log("========================");
    return has.software_package("Microsoft Visual Studio Code", "1.3.1");
})
.then(function (result) {
    console.log(result);
    console.log("========================");
    return has.port.listening("80");
})
.then(function (result) {
    console.log(result);
    console.log("========================");
})
.catch(function (result) {
    console.log(result);
});


