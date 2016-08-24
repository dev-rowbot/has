# HAS - A Javascript Host Assertion Suite

HAS was initially developed to be a Javascript implementation of Serverspec and borrows heavily from Serverspec/Specinfra.   
It is still early days but the intention is to replicate all/most of Specinfra's functionality. Once complete HAS will tests your 
servers' actual state by executing commands locally, via SSH, via WinRM, via Docker API and so on.   
For now only WinRM is supported and a forked version of winrmjs is used.

HAS works well with `jasmine-node` - see the example in the [usage section](#usage-with-jasmine-node).

## Installation
Since this is a work-in-progress the installation instructions may look a little odd... 
```
npm install --save-dev git+ssh://git@github.com:dev-rowbot/has.git
```

## Usage

HAS uses `loglevel` internally for debug, you can alter the default debug levels to see more info around commands and results.
Simply pass the required loglevel to `has.environment(os, hostname, user, password, loglevel)`   

**CAUTION:** HAS does not behave as a singleton - it follows a module pattern to
avoid issue with asynchronous calls during testing. 

A simple example for checking if a user exists and belongs to a group:   

```javascript
var has = require('./index.js')();

var settings = has.environment.default();
settings.os       = 'windows'; 
settings.hostname = '192.168.58.3'; 
settings.username = 'Vagrant'; 
settings.password = 'vagrant'; 
settings.protocol = 'http'; 
has.environment(settings, 'DEBUG');
has.user('Vagrant')
    .then(function (result) {
        console.log(result);
        return has.user.who_belongs_to_group('Administrators');
    })
    .then(function (result) {
        console.log(result);
    });
```

As per the example you need to set the environment first before calling any of the Assertion Tests. 

Where possible results are `true` or `false`. This allows HAS to be wrapped up neatly in a jasmine test spec.

### Usage with jasmine-node
jasmine provides a nice framework for validating the has returns. To execute the example below you will need to first install `jasmine-node`.
You will notice that the test names reference "Playbook" - has was written/developed with Ansible playbooks in mind.
In this example a playbooks called "ensure-default-software-installed" and "ensure-filebeat" need to be tested.
The standard jasmine-node describe() and it() are used for asynchronous functions 

```javascript
var yaml = require('yamljs');

var settings = yaml.load('./group_vars/all.yml');

hostList = ['webserver.01.test.com',
            'webserver.02.test.com',
            'dbserver.01.test.com'];

// For each host - execute the same set of tests
hostList.forEach(function (hostname) {
    /* ---------------------------------------------------- */
    /* Setup 'has' for each host                            */
    /* ---------------------------------------------------- */
    var has = require('has')();
    var hostSettings = has.environment.default();

    hostSettings.os = 'windows';
    hostSettings.hostname = hostname;
    hostSettings.username = settings.ansible_user;
    hostSettings.password = settings.ansible_password;
    hostSettings.protocol = 'https';

    has.environment(hostSettings);
    /* -------------------------------------------------- */

    /* -------------------------------------------------- */
    /* Group the tests by Playbook - this makes it easier */
    /* to see what tests are missing for a given playbook */
    /* -------------------------------------------------- */
    describe("Playbook ensure-default-software-installed", function () {
        /* -------------------------------------------------- */
        /* You can create a sub-group if a single test is not */
        /* enough to validate the ansible action              */
        /* -------------------------------------------------- */
        describe(`${hostname} Ensure Chocolatey is installed`, function () {
            describe(`Chocolatey exe exists`, function () {
                it("should be true", function (done) {
                    // Remember to handle the promise rejection scenario or tests will timeout
                    // instead of giving proper feedback
                    has.file(settings.chocolatey_install_path + '/choco.exe').then(function (result) {
                        expect(result).toBe(true);
                        done();
                    }, function(result) {
                        expect(result.message).toBe(true);
                        done();
                    });
                }, DEFAULT_TIMEOUT);
            });
            describe(`Chocolatey has correct version`, function () {
                it("should be true", function (done) {
                    has.file.with_version(settings.chocolatey_install_path + '/choco.exe', '0.9.9.11').then(function (result) {
                        expect(result).toBe(true);
                        done();
                    }, function(result) {
                        expect(result.message).toBe(true);
                        done();
                    });
                }, DEFAULT_TIMEOUT);
            });
        });
        describe(`${hostname} Ensure VisualStudioCode is installed`, function () {
            describe(`VisualStudioCode is installed`, function () {
                it("should be true", function (done) {
                    // The version is optional
                    has.software_package("Microsoft Visual Studio Code", "1.3.1").then(function (result) {
                        expect(result).toBe(true);
                        done();
                    }, function(result) {
                        expect(result.message).toBe(true);
                        done();
                    });
                }, DEFAULT_TIMEOUT);
            });
        });
    });
});

```
Have a look at the test directory for a more complete example.

----
## Credit
Thanks to the Serverspec team for doing all the heavy lifting.   
You can find more info here: 
* [serverspec.org](http://serverspec.org/)
* [GitHub/serverspec](https://github.com/mizzy/serverspec)
* [GitHub/specinfra](https://github.com/mizzy/specinfra)

## Maintenance policy of HAS

* The person who found a bug should fix the bug by themself.
* If you find a bug and cannot fix it by yourself, send a pull request and attach test code to reproduce the bug, please.
* The person who want a new feature should implement it by themself.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
