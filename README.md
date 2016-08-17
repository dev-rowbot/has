# HAS - A Javascript H(ost) A(ssertion) S(uite)

HAS was initially developed to be a Javascript implementation of Serverspec and borrows heavily from Serverspec/Specinfra.   
It is still early days but the intention is to replicate all/most of Serverspec's functionality. Once complete HAS will tests your 
servers' actual state by executing commands locally, via SSH, via WinRM, via Docker API and so on.   
For now only WinRM is supported and a forked version of winrmjs is used.

## Installation
Since this is a work-in-progress the installation instructions may look a little odd... 
```
npm install --save-dev git+ssh://git@github.com:dev-rowbot/has.git
```

## Usage

HAS uses ```loglevel``` internally for debug, you can alter the default debug levels to see more info around commands and results.
Simply pass the required loglevel to ```has.environment(os, hostname, user, password, loglevel)```   

A simple example for checking if a user exists and belongs to a group:   
```
var has = require('./index.js');

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

Where possible results are ```true``` or ```false```. This should allow HAS to be wrapped up neatly in a jasmine test spec.

----

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
