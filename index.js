/* eslint no-undef: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */

var log = require('loglevel');

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

// Feature Specific Functionality
has.feature = {};

has.feature.enabled = function (name, provider) {
    return local.settings.host.feature.check_is_enabled(name, provider);
};

// File Specific Functionality
has.file = {};

has.file.which_exists = function (file) {
    return local.settings.host.file.exists(file);
};

has.file.which_is_a_file = function (file) {
    return local.settings.host.file.check_is_file(file);
};

has.file.which_is_a_directory = function (dir) {
    return local.settings.host.file.check_is_directory(dir);
};

has.file.which_is_hidden = function (file) {
    return local.settings.host.file.check_is_hidden(file);
};

has.file.which_is_readonly = function (file) {
    return local.settings.host.file.check_is_readonly(file);
};

has.file.which_is_system_file = function (file) {
    return local.settings.host.file.check_is_system(file);
};

has.file.content = function (file) {
    return local.settings.host.file.get_content(file);
};

has.file.accesible_by_user = function (file, user, access) {
    return local.settings.host.file.check_is_accessible_by_user(file, user, access);
};

has.file.which_contains = function (file, pattern) {
    return local.settings.host.file.check_contains(file, pattern);
};

has.file.which_contains_within = function (file, pattern, from, to) {
    return local.settings.host.file.check_contains_within(file, pattern, from, to);
};

has.file.with_version = function (file, version) {
    return local.settings.host.file.check_has_version(file, version);
};

has.file.owned_by = function (file, owner) {
    return local.settings.host.file.check_has_version(file, owner);
};


