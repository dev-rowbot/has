/* eslint no-undef: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */

var log = require('loglevel');
var q = require('q');

// local settings - not exported
var local = {};

local.settings = {
    hostname: '',
    os: '',
    username: '',
    password: '',
    host: undefined,
    protocol: undefined
};

// has specific functionality
var has = module.exports = {};

has.environment = function (settings, debugLevel) {
    local.settings.hostname = settings.hostname;
    local.settings.os = settings.os;
    local.settings.username = settings.username;
    local.settings.password = settings.password;
    local.settings.protocol = settings.protocol;

    switch (settings.os) {
        case 'windows': {
            local.settings.host = require('./command/windows/base.js');
            break;
        }
        default: {
            throw "Only Windows is supported currently";
        }
    }

    if (debugLevel !== undefined) {
        log.getLogger('windows-base').setLevel(debugLevel);
    }

    // Set the params
    local.settings.host.setParams(local.settings.hostname,
        local.settings.username,
        local.settings.password,
        local.settings.protocol);
};

has.environment.default = function () {
    return {
        hostname: '',
        os: 'windows',
        username: '',
        password: '',
        protocol: 'https'
    };
};
// Feature Specific Functionality
has.feature = {};

has.feature.enabled = function (name, provider) {
    return local.settings.host.feature.check_is_enabled(name, provider);
};

// Local file functions to be used internally
local.file = {};

local.file = function(file) {
    return local.settings.host.file.check_exists(file);
};

// We need to validate the file exists before attempting the next command
local.file.exec = function (file, func) {
    var dfd = q.defer();

    // Check if the file exists first
    local.file(file).then(function (result) {
        if (result === false) {
            dfd.resolve(result);
            return;
        }
        // now execute the function passed in
        func(file).then(function (result) {
            dfd.resolve(result);
        });
    });
    return dfd.promise;
};

// File
has.file = {};

has.file = function (file) {
    has.file.filename = file;
    return local.settings.host.file.check_exists(file);
};

has.file.which_is_a_file = function (file) {
    has.file.filename = file;

    return local.file.exec(file, local.settings.host.file.check_is_file);
};

has.file.which_is_a_directory = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.check_is_directory);
};

has.file.which_is_hidden = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.check_is_hidden);
};

has.file.which_is_readonly = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.check_is_readonly);
};

has.file.which_is_a_system_file = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.check_is_system);
};

has.file.get_content = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.get_content);
};

has.file.md5 = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.get_md5sum);
};

has.file.which_is_accesible_by_user = function (file, user, access) {
    has.file.filename = file;
    var dfd = q.defer();

    // Check if the file exists first
    local.file(file).then(function (result) {
        if (result === false) {
            dfd.resolve(result);
            return;
        }
        // now execute the function passed in
        local.settings.host.file.check_is_accessible_by_user(file, user, access).then(function (result) {
            dfd.resolve(result);
        });
    });
    return dfd.promise;
};

has.file.which_contains = function (file, pattern) {
    has.file.filename = file;
    var dfd = q.defer();

    // Check if the file exists first
    local.file(file).then(function (result) {
        if (result === false) {
            dfd.resolve(result);
            return;
        }
        // now execute the function passed in
        local.settings.host.file.check_contains(file, pattern).then(function (result) {
            dfd.resolve(result);
        });
    });
    return dfd.promise;
};

has.file.which_contains_between = function (file, pattern, from, to) {
    has.file.filename = file;
    var dfd = q.defer();

    // Check if the file exists first
    local.file(file).then(function (result) {
        if (result === false) {
            dfd.resolve(result);
            return;
        }
        // now execute the function passed in
        local.settings.host.file.check_contains_within(file, pattern, from, to).then(function (result) {
            dfd.resolve(result);
        });
    });
    return dfd.promise;
};

has.file.with_version = function (file, version) {
    has.file.filename = file;
    var dfd = q.defer();

    // Check if the file exists first
    local.file(file).then(function (result) {
        if (result === false) {
            dfd.resolve(result);
            return;
        }
        // now execute the function passed in
        local.settings.host.file.check_has_version(file, version).then(function (result) {
            dfd.resolve(result);
        });
    });
    return dfd.promise;
};

has.file.owned_by = function (file, owner) {
    has.file.filename = file;
    var dfd = q.defer();

    // Check if the file exists first
    local.file(file).then(function (result) {
        if (result === false) {
            dfd.resolve(result);
            return;
        }
        // now execute the function passed in
        local.settings.host.file.check_is_owned_by(file, owner).then(function (result) {
            dfd.resolve(result);
        });
    });
    return dfd.promise;
};

// Group Specific Functionality
has.group = {};

has.group = function (group) {
    return local.settings.host.group.check_exists(group);
};

// Host Specific Functionality
has.host = {};

has.host.resolvable = function (name, type) {
    return local.settings.host.host.check_is_resolvable(name, type);
};

has.host.reachable = function (host, protocol, timeout, port) {
    return local.settings.host.host.check_is_reachable(host, protocol, timeout, port);
};

// Hotfix Specific Functionality
has.hotfix = {};

has.hotfix.installed = function (description, hot_fix_id) {
    return local.settings.host.hotfix.check_is_installed(description, hot_fix_id);
};

// IIS App Pool Specific Functionality
has.iis_app_pool = {};

has.iis_app_pool.which_exists = function (name) {
    has.iis_app_pool.name = name;
    return local.settings.host.iis_app_pool.check_exists(name);
};

has.iis_app_pool.with_dotnet_version = function (name, option) {
    if (option === undefined && has.iis_app_pool.name !== undefined) {
        option = name;
        name = has.iis_app_pool.name;
    }
    else {
        has.iis_app_pool.name = name;
    }

    return local.settings.host.iis_app_pool.check_has_dotnet_version(name, option);
};

has.iis_app_pool.with_32bit_enabled = function (name) {
    has.iis_app_pool.name = name;
    return local.settings.host.iis_app_pool.check_has_32bit_enabled(name);
};

has.iis_app_pool.with_idle_timeout_of = function (name, option) {
    if (option === undefined && has.iis_app_pool.name !== undefined) {
        option = name;
        name = has.iis_app_pool.name;
    }
    else {
        has.iis_app_pool.name = name;
    }

    return local.settings.host.iis_app_pool.check_has_idle_timeout(name, minutes);
};

has.iis_app_pool.with_identity_type = function (name, option) {
    if (option === undefined && has.iis_app_pool.name !== undefined) {
        option = name;
        name = has.iis_app_pool.name;
    }
    else {
        has.iis_app_pool.name = name;
    }
    return local.settings.host.iis_app_pool.check_has_identity_type(name, type);
};

has.iis_app_pool.with_user_profile = function (name) {
    has.iis_app_pool.name = name;
    return local.settings.host.iis_app_pool.check_has_user_profile(name);
};

has.iis_app_pool.which_has_username = function (name, option) {
    if (option === undefined && has.iis_app_pool.name !== undefined) {
        option = name;
        name = has.iis_app_pool.name;
    }
    else {
        has.iis_app_pool.name = name;
    }
    return local.settings.host.iis_app_pool.check_has_username(name, username);
};

has.iis_app_pool.with_periodic_restart_of = function (name, option) {
    if (option === undefined && has.iis_app_pool.name !== undefined) {
        option = name;
        name = has.iis_app_pool.name;
    }
    else {
        has.iis_app_pool.name = name;
    }
    return local.settings.host.iis_app_pool.check_has_periodic_restart(name, username);
};

has.iis_app_pool.which_has_managed_pipeline_mode = function (name, option) {
    if (option === undefined && has.iis_app_pool.name !== undefined) {
        option = name;
        name = has.iis_app_pool.name;
    }
    else {
        has.iis_app_pool.name = name;
    }
    return local.settings.host.iis_app_pool.check_has_managed_pipeline_mode(name, username);
};

// IIS Website Specific Functionality
has.iis_website = {};

has.iis_website.which_is_enabled = function (name) {
    has.iis_website.name = name;
    return local.settings.host.iis_website.check_is_enabled(name);
};

has.iis_website.installed = function (name) {
    has.iis_website.name = name;
    return local.settings.host.iis_website.check_is_installed(name);
};

has.iis_website.running = function (name) {
    has.iis_website.name = name;
    return local.settings.host.iis_website.check_is_running(name);
};

has.iis_website.in_app_pool = function (name, option) {
    if (option === undefined && has.iis_website.name !== undefined) {
        option = name;
        name = has.iis_website.name;
    }
    else {
        has.iis_website.name = name;
    }

    return local.settings.host.iis_website.check_is_in_app_pool(name, option);
};

has.iis_website.with_physical_path = function (name, option) {
    if (option === undefined && has.iis_website.name !== undefined) {
        option = name;
        name = has.iis_website.name;
    }
    else {
        has.iis_website.name = name;
    }

    return local.settings.host.iis_website.check_has_physical_path(name, option);
};

has.iis_website.with_site_bindings = function (name, port, protocol, ipaddress, host_header) {
    has.iis_website.name = name;

    return local.settings.host.iis_website.check_has_site_bindings(name, port, protocol, ipaddress, host_header);
};

has.iis_website.with_virtual_directory = function (name, vdir, path) {
    has.iis_website.name = name;

    return local.settings.host.iis_website.check_has_virtual_dir(name, vdir, path);
};

has.iis_website.with_site_application = function (name, app, pool, physical_path) {
    has.iis_website.name = name;

    return local.settings.host.iis_website.check_has_site_application(name, port, protocol, ipaddress, host_header);
};

// Port Specific Functionality
has.port = {};

has.port.listening = function (port) {
    has.port.port = port;
    return local.settings.host.port.check_is_listening(port);
};

has.port.listening.with_protocol = function (port, protocol) {
    if (protocol === undefined && has.port.port !== undefined) {
        // Use the last port instead
        protocol = port;
        port = has.port.port;
    }
    return local.settings.host.port.check_is_listening_with_protocol(port, protocol);
};

// Process Specific Functionality
has.process = {};

has.process.check = function (process) {
    has.process.process = process;
    return local.settings.host.process.check_process(process);
};

has.process.get = function (process, opts) {
    has.process.process = process;
    return local.settings.host.process.get(process, opts);
};

// Reg Key Specific Functionality
has.registry_key = {};

has.registry_key.properties = function (key_name) {
    has.registry_key.key_name = key_name;
    return local.settings.host.registry_key.check_exists(key_name);
};

// Schedule Task Specific Functionality
has.scheduled_task = {};

has.scheduled_task = function (name) {
    has.scheduled_task.name = name;
    return local.settings.host.scheduled_task.check_exists(name);
};

// Schedule Task Specific Functionality
has.service = {};

has.service.installed = function (service) {
    has.service.service = service;
    return local.settings.host.service.check_is_installed(service);
};

has.service.with_start_mode = function (service, mode) {
    has.service.service = service;
    return local.settings.host.service.check_has_start_mode(service, mode);
};

has.service.enabled = function (service, level) {
    has.service.service = service;
    return local.settings.host.service.check_is_enabled(service);
};

has.service.running = function (service) {
    has.service.service = service;
    return local.settings.host.service.check_is_running(service);
};

has.service.with_property = function (service, property) {
    has.service.service = service;
    return local.settings.host.service.check_has_property(service, property);
};

// Feature Specific Functionality
has.software_package = {};

has.software_package = function (soft_package, version) {
    return local.settings.host.soft_package.check_is_installed(soft_package, version);
};


// User Specific Functionality
has.user = {};

has.user = function (user) {
    has.user.username = user;
    return local.settings.host.user.check_exists(user);
};

has.user.who_belongs_to_group = function (user, group) {
    if (group === undefined && has.user.username !== undefined) {
        // Use the last username instead
        group = user;
        user = has.user.username;
    }

    return local.settings.host.user.check_belongs_to_group(user, group);
};


