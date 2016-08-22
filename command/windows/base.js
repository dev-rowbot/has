
var winrm = require('winrmjs');
var q = require('q');
var log = require('loglevel').getLogger('windows-base');

base = function () {
    baseObject = {};
    baseObject.name = 'base_' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);

    baseObject.winrmParams = {};
    baseObject.winrmParams.host = '';
    baseObject.winrmParams.port = 5985;
    baseObject.winrmParams.path = '/wsman';
    baseObject.winrmParams.username = '';
    baseObject.winrmParams.password = '';
    baseObject.winrmParams.script_root = __dirname + '/../../backend/powershell/support/';

    baseObject.windows_account = function (account) {
        var match = account.match(/((.+)\\)?(.+)/);
        var domain = match[2];
        var name = match[3];
        return { name: name, domain: domain };
    };

    baseObject.exec = function (cmd, script) {
        var dfd = q.defer();

        log.error('EXEC: ' + this.name);
        log.error('HOST ' + this.winrmParams.host + ' ==> CMD ' + cmd);

        var run_params = winrm.get_run_params(this.winrmParams.host,
            this.winrmParams.port,
            this.winrmParams.path,
            this.winrmParams.username,
            this.winrmParams.password);

        run_params.script_root = this.winrmParams.script_root;

        // Verbose Debug
        log.debug(JSON.stringify(run_params) + '\n');
        log.debug('CMD: ' + cmd);
        log.debug('SCRIPT: ' + script);

        var result = false;

        winrm.open_shell(run_params).then(function (shell_id) {
            run_params.shell_id = shell_id;
            run_params.command = cmd;
            if (script !== undefined) {
                return winrm.run_powershell_script(run_params, script);
            }
            return winrm.run_powershell(run_params);
        }).then(function (command_id) {
            run_params.command_id = command_id;
            return winrm.get_command_output(run_params);
        }).then(function (res) {
            // Check for True or False - otherwise return the value
            // Some tests are checkign a files MD5 so true/false is not acceptable
            result = res.output.startsWith('True') ? true : (res.output.startsWith('False') ? false : res.output);
            if (!res.output.startsWith('True') && !res.output.startsWith('False')) {
                log.debug('[CMD] ' + cmd + '\n[OUT] ' + res.output);
            }
            return winrm.close_command(run_params);
        }).then(function (res) {
            return winrm.close_shell(run_params);
        }).catch(function (err) {
            log.error(err);
            dfd.reject(err);
        }).fin(function () {
            log.info('[CMD] ' + cmd + '\n[RES] ' + result);
            dfd.resolve(result);
        });

        return dfd.promise;

    };

    baseObject.execParams = {
        exec: undefined,
        windows_account: undefined,
        name: undefined 
    };

    baseObject.getParams = function () {
        return this.execParams;
    };

    baseObject.feature = require('./base/feature.js');
    baseObject.group = require('./base/group.js');
    baseObject.port = require('./base/port.js');
    baseObject.user = require('./base/user.js');
    baseObject.iis_app_pool = require('./base/iis_app_pool.js');
    baseObject.iis_website = require('./base/iis_website.js');
    baseObject.soft_package = require('./base/soft_package.js');
    baseObject.file = require('./base/file.js');
    baseObject.hot_fix = require('./base/hot_fix.js');
    baseObject.process = require('./base/process.js');
    baseObject.scheduled_task = require('./base/scheduled_task.js');
    baseObject.service = require('./base/service.js');

    baseObject.setParams = function (host, username, password, protocol) {
        this.winrmParams.host = host;
        this.winrmParams.username = username;
        this.winrmParams.password = password;
        if (protocol === 'https') {
            this.winrmParams.port = 5986;
        }

        this.execParams.exec = this.exec;
        this.execParams.windows_account = this.windows_account;
        this.execParams.name = this.name;

    };
    return baseObject;
};

module.exports = base;
