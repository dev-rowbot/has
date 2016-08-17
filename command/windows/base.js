base = {};
base.windows = {};

var winrm = require('winrmjs');
var q = require('q');
var log = require('loglevel').getLogger('windows-base');

var winrmParams = {
    host: '',
    port: 5985,
    path: '/wsman',
    username: '',
    password: '',
    script_root: __dirname + '/../../backend/powershell/support/'
};

base.windows.windows_account = function (account) {
    var match = account.match(/((.+)\\)?(.+)/);
    var domain = match[2];
    var name = match[3];
    return { name: name, domain: domain };
}

base.windows.exec = function (cmd, script) {
    var dfd = q.defer();

    var run_params = winrm.get_run_params(winrmParams.host,
        winrmParams.port,
        winrmParams.path,
        winrmParams.username,
        winrmParams.password);

    run_params.script_root = winrmParams.script_root;

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

base.windows.execParams = {
    exec: base.windows.exec,
    windows_account: base.windows.windows_account
};

base.windows.feature = require('./base/feature.js');
base.windows.group = require('./base/group.js');
base.windows.port = require('./base/port.js');
base.windows.user = require('./base/user.js');
base.windows.iis_app_pool = require('./base/iis_app_pool.js');
base.windows.iis_website = require('./base/iis_website.js');
base.windows.soft_package = require('./base/soft_package.js');
base.windows.file = require('./base/file.js');
base.windows.hot_fix = require('./base/hot_fix.js');
base.windows.process = require('./base/process.js');
base.windows.scheduled_task = require('./base/scheduled_task.js');
base.windows.service = require('./base/service.js');

base.windows.setParams = function (host, username, password, protocol) {
    winrmParams.host = host;
    winrmParams.username = username;
    winrmParams.password = password;
    if (protocol === 'https') {
        winrmParams.port = 5986;
    }

    base.windows.feature.setParams(base.windows.execParams);
    base.windows.group.setParams(base.windows.execParams);
    base.windows.port.setParams(base.windows.execParams);
    base.windows.user.setParams(base.windows.execParams);
    base.windows.iis_app_pool.setParams(base.windows.execParams);
    base.windows.iis_website.setParams(base.windows.execParams);
    base.windows.soft_package.setParams(base.windows.execParams);
    base.windows.file.setParams(base.windows.execParams);
    base.windows.hot_fix.setParams(base.windows.execParams);
    base.windows.process.setParams(base.windows.execParams);
    base.windows.scheduled_task.setParams(base.windows.execParams);
    base.windows.service.setParams(base.windows.execParams);

};

module.exports = {
    setParams: base.windows.setParams,
    feature: base.windows.feature,
    group: base.windows.group,
    user: base.windows.user,
    port: base.windows.port,
    iis_app_pool: base.windows.iis_app_pool,
    iis_website: base.windows.iis_website,
    soft_package: base.windows.soft_package,
    file: base.windows.file,
    hot_fix: base.windows.hot_fix,
    process: base.windows.process,
    scheduled_task: base.windows.scheduled_task,
    service: base.windows.service
};
