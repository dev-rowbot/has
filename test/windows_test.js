/* eslint no-undef: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */

var windows = require('./command/windows/base.js');
var log = require('loglevel');

log.getLogger('windows-base').setLevel("DEBUG");

windows.setParams('192.168.58.3', 'Vagrant', 'vagrant');

//windows.feature.check_is_enabled('IIS-Webserver', 'dism');
//windows.user.check_belongs_to_group('Vagrant', 'Administrators');
//windows.group.check_exists('LAB-WS01\\Administrators');
//windows.feature.check_is_enabled('IIS-Webserver', 'powershell');

// Test Software
if (0) {
    windows.soft_package.check_is_installed ('Oracle VM VirtualBox Guest Additions')
    .then(function() { return windows.soft_package.check_is_installed ('Oracle VM VirtualBox Guest Additions', '5.0.26.0'); });
}

// Test Hot Fix
if (0) {
    windows.hot_fix.check_is_installed ('KB3139165')
    .then(function() { return windows.hot_fix.check_is_installed ('High CPU load on a Windows Server 2012 R2-based server because NAT keep-alive timer isn\'t cleaned up - KB3139165'); })
    .then(function() { return windows.hot_fix.check_is_installed ('High CPU load on a Windows Server 2012 R2-based server because NAT keep-alive timer isn\'t cleaned up', 'KB3139165'); });
}

// Test Process
if (0) {
    windows.process.check_process ('VBoxTray')
    .then(function() { return windows.process.get ('VBoxTray.exe', 'pid'); })
    .then(function() { return windows.process.get ('VBoxTray.exe', 'user'); })
    .then(function() { return windows.process.get ('VBoxTray.exe', 'Priority'); });
}

// Test File functionality
if (0) {
    windows.file.check_exists('c:\\test.txt')
    .then(function() { return windows.file.check_is_file('c:\\test.txt'); })
    .then(function() { return windows.file.check_is_directory('c:\\test.txt'); })
    .then(function() { return windows.file.check_is_hidden('c:\\test.txt'); })
    .then(function() { return windows.file.check_is_readonly('c:\\test.txt'); })
    .then(function() { return windows.file.get_content('c:\\test.txt'); })
    .then(function() { return windows.file.get_md5sum('c:\\test.txt'); })
    .then(function() { return windows.file.check_is_owned_by('c:\\test.txt', 'Vagrant'); })
    .then(function() { return windows.file.check_contains('c:\\test.txt', 'hello'); })
    .then(function() { return windows.file.check_contains_within('c:\\test.txt', 'hello'); });
}

// Various Checks
if (0) {
    windows.feature.check_is_enabled('IIS-Webserver', 'dism')
        .then(function (res) { console.log(res); return windows.feature.check_is_enabled('IIS-Webserver', 'powershell'); })
        .then(function (res) { console.log(res); return windows.feature.check_is_enabled('IIS-Webserver'); })
        .then(function (res) { console.log(res); return windows.feature.check_is_enabled('SMB1Protocol'); })
        .then(function (res) { console.log(res); return windows.feature.check_is_enabled('Minesweeper'); })
        .then(function (res) { console.log(res); return windows.group.check_exists('LAB-WS01\\Administrators'); })
        .then(function (res) { console.log(res); return windows.port.check_is_listening('80'); })
        .then(function (res) { console.log(res); return windows.port.check_is_listening('49168'); })
        .then(function (res) { console.log(res); return windows.user.check_exists('Vagrant'); })
        .then(function (res) { console.log(res); return windows.user.check_belongs_to_group('Vagrant', 'Administrators'); })
        .then(function (res) { console.log(res); return windows.user.check_belongs_to_group('Vagrant', 'Users'); })
        .then(function (res) { console.log(res); return windows.user.check_exists('Guest'); })
        .then(function (res) { console.log(res); return windows.user.check_belongs_to_group('Guest', 'Administrators'); })
        .then(function (res) { console.log(res); return windows.user.check_belongs_to_group('Guest', 'Users'); })
        .then(function (res) { console.log(res); return windows.user.check_belongs_to_group('Guest', 'Guests'); })
        .fail(function (err) {
            console.log('Failure ' + err);
        })
        .done();
}
