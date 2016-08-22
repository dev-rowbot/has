/* eslint no-undef: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */

var has_module = require('../index.js');

has = [];
has[0] = new has_module();
has[1] = new has_module();

var settings = has[0].environment.default();
settings.os = 'windows';
settings.hostname = '192.168.58.3';
settings.username = 'Vagrant';
settings.password = 'vagrant';
settings.protocol = 'http';
has[0].environment(settings);
console.log("START Test 0: " + has[0].name);

has[0].file('c:\\test.txt').then(function (result) {
    console.log("Test 0: " + has[0].name + " test.txt ==> " + result);
    return has[0].file.with_version('c:\\ProgramData\\chocolatey\\choco.exe', '0.9.9.12');
})
    .then(function (result) {
        console.log("Test 0: " + has[0].name + " Version ==> " + result);
        return has[0].feature.enabled('IIS-Webserver', 'dism');
        
    })
    .then(function (result) {
        console.log("Test 0: " + has[0].name + " Feature ==> " + result);
        
    })
    .catch(function (result) {console.log (result);});

if (1) {

    var settings = has[1].environment.default();
    settings.os = 'windows';
    settings.hostname = '192.168.58.4';
    settings.username = 'Vagrant';
    settings.password = 'vagrant';
    settings.protocol = 'http';
    has[1].environment(settings);
    console.log("START Test 1: " + has[1].name);

    has[1].file('c:\\test.txt').then(function (result) {
        console.log("Test 1: " + has[1].name + " test.txt ==> " + result);
        return has[1].file.with_version('c:\\ProgramData\\chocolatey\\choco.exe', '0.9.9.12');
    })
        .then(function (result) {
            console.log("Test 1: " + has[1].name + " Version ==> " + result);
        });

}

