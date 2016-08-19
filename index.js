/* eslint no-undef: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */

// Requires
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

/**
 * Setup the environment - **needs to be called before any other commands** 
 * @param {object} settings - The settings to used
 * @param {string} debugLevel - The debug level to use - see 'loglevel' 
 */
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

/**
 * Get the default environment settings
 * @returns {object} defaultSettings 
 */
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

/**
 * Check if Windows host has a Feature enabled/installed
 * @param {string} name The feature name  
 * @param {string} [provider] Check how feature was installed - options are ```dism``` or ```powershell```  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` - resolves ```true``` or ```false```
 */
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

/**
 * Check if a file exists on a host
 * @param {string} file The file name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.file = function (file) {
    has.file.filename = file;
    return local.settings.host.file.check_exists(file);
};

/**
 * Check if a file is of type file
 * @param {string} file The file name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.file.which_is_a_file = function (file) {
    has.file.filename = file;

    return local.file.exec(file, local.settings.host.file.check_is_file);
};

/**
 * Check if a file is of type directory
 * @param {string} file The file name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.file.which_is_a_directory = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.check_is_directory);
};

/**
 * Check if a file is hidden
 * @param {string} file The file name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.file.which_is_hidden = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.check_is_hidden);
};

/**
 * Check if a file is read only
 * @param {string} file The file name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.file.which_is_readonly = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.check_is_readonly);
};

/**
 * Check if a file is a system file
 * @param {string} file The file name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.file.which_is_a_system_file = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.check_is_system);
};

/**
 * Get the files content
 * @param {string} file The file name  
 * @returns {Promise} A promise - resolves with the file content 
 */
has.file.get_content = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.get_content);
};

/**
 * Check if a file is a system file
 * @param {string} file The file name  
 * @returns {Promise} A promise - resolves with the files MD5 hash 
 */
has.file.md5 = function (file) {
    has.file.filename = file;
    return local.file.exec(file, local.settings.host.file.get_md5sum);
};

/**
 * Check if a file is accessible by a user
 * @param {string} file The file name  
 * @param {string} user The user name  
 * @param {string} access The file access type - r/w/x  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check if a file contains a search pattern
 * @param {string} file The file name  
 * @param {string} pattern The search pattern to use  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check if a file contains a search pattern
 * @param {string} file The file name  
 * @param {string} pattern The search pattern to use  
 * @param {string} from The search start delimiter  
 * @param {string} to The search end delimiter
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check if a file version matches
 * @param {string} file The file name  
 * @param {string} version The version to compare against  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check if a file is owned by a user
 * @param {string} file The file name  
 * @param {string} owner The username to compare against  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check if a group exists
 * @param {string} group The group name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.group = function (group) {
    return local.settings.host.group.check_exists(group);
};

// Host Specific Functionality
has.host = {};

/**
 * Check if a host is resolvable
 * @param {string} name The host name  
 * @param {string} type The host type  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.host.resolvable = function (name, type) {
    return local.settings.host.host.check_is_resolvable(name, type);
};

/**
 * Check if a host is network reachable
 * @param {string} name The host name  
 * @param {string} protcol The protocol to validate  
 * @param {string} timeout The timeout to use  
 * @param {string} port The port to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check if a IIS App Pool exists
 * @param {string} name The app pool name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.iis_app_pool.which_exists = function (name) {
    has.iis_app_pool.name = name;
    return local.settings.host.iis_app_pool.check_exists(name);
};

/**
 * Check .Net version of IIS App Pool
 * @param {string} name The app pool name  
 * @param {string} Verison The expected version  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check if IIS App Pool has 32 bit enabled
 * @param {string} name The app pool name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.iis_app_pool.with_32bit_enabled = function (name) {
    has.iis_app_pool.name = name;
    return local.settings.host.iis_app_pool.check_has_32bit_enabled(name);
};

/**
 * Check the idle timeout of an IIS App Pool
 * @param {string} name The app pool name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check the identity of an IIS App Pool
 * @param {string} name The app pool name  
 * @param {string} type The identity type  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check the IIS App Pool has a user profile
 * @param {string} name The app pool name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.iis_app_pool.with_user_profile = function (name) {
    has.iis_app_pool.name = name;
    return local.settings.host.iis_app_pool.check_has_user_profile(name);
};

/**
 * Check the IIS App Pool has a user name
 * @param {string} name The app pool name  
 * @param {string} username The username to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check the IIS App Pool has the correct periodic restart timeout
 * @param {string} name The app pool name  
 * @param {string} timeout The expected timeout  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check the IIS App Pool has the correct managed piepline mode
 * @param {string} name The app pool name  
 * @param {string} mode The expected mode  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check the IIS Web Site is installed
 * @param {string} name The website name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.iis_website.installed = function (name) {
    has.iis_website.name = name;
    return local.settings.host.iis_website.check_is_installed(name);
};

/**
 * Check the IIS Web Site is running
 * @param {string} name The website name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.iis_website.running = function (name) {
    has.iis_website.name = name;
    return local.settings.host.iis_website.check_is_running(name);
};

/**
 * Check the IIS Web Site is in the correct app pool
 * @param {string} name The website name  
 * @param {string} pool The app pool name  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check the IIS Web Site has the correct physical path
 * @param {string} name The website name  
 * @param {string} path The physical path expected  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check the IIS Web Site has the correct site bindings
 * @param {string} name The website name  
 * @param {string} port The port expected  
 * @param {string} protocol The protocol expected  
 * @param {string} ipaddress The IP address expected  
 * @param {string} host_header The host header expected  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.iis_website.with_site_bindings = function (name, port, protocol, ipaddress, host_header) {
    has.iis_website.name = name;

    return local.settings.host.iis_website.check_has_site_bindings(name, port, protocol, ipaddress, host_header);
};

/**
 * Check the IIS Web Site has a virtual directory configured
 * @param {string} name The website name  
 * @param {string} vdir The virtual directory expected  
 * @param {string} path The path expected  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.iis_website.with_virtual_directory = function (name, vdir, path) {
    has.iis_website.name = name;

    return local.settings.host.iis_website.check_has_virtual_dir(name, vdir, path);
};

/**
 * Check the IIS Web Site has a site application configured
 * @param {string} name The website name  
 * @param {string} app The application tov alidate  
 * @param {string} pool The pool expected  
 * @param {string} physical_path The Websites physical path expected  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.iis_website.with_site_application = function (name, app, pool, physical_path) {
    has.iis_website.name = name;

    return local.settings.host.iis_website.check_has_site_application(name, port, protocol, ipaddress, host_header);
};

// Port Specific Functionality
has.port = {};

/**
 * Check the host has a port listening
 * @param {string} port The port to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.port.listening = function (port) {
    has.port.port = port;
    return local.settings.host.port.check_is_listening(port);
};

/**
 * Check the host has a port listening with a specified protocol
 * @param {string} port The port to validate  
 * @param {string} protocol The protocol to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check the host has a process
 * @param {string} process The process to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
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

/**
 * Check the windows host has the specified registry key
 * @param {string} key_name The Key to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.registry_key = function (key_name) {
    has.registry_key.key_name = key_name;
    return local.settings.host.registry_key.check_exists(key_name);
};

// Schedule Task Specific Functionality
has.scheduled_task = {};

/**
 * Check the windows host has a task scheduled
 * @param {string} name The task name to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.scheduled_task = function (name) {
    has.scheduled_task.name = name;
    return local.settings.host.scheduled_task.check_exists(name);
};

// Service Task Specific Functionality
has.service = {};

/**
 * Check the host has a service installed
 * @param {string} service The service name to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.service.installed = function (service) {
    has.service.service = service;
    return local.settings.host.service.check_is_installed(service);
};

/**
 * Check the host has a service with start mode
 * @param {string} service The service name to validate  
 * @param {string} mode The expected start mode (Auto/Manual/etc.)  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.service.with_start_mode = function (service, mode) {
    has.service.service = service;
    return local.settings.host.service.check_has_start_mode(service, mode);
};

/**
 * Check the host has a service enabled
 * @param {string} service The service name to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.service.enabled = function (service, level) {
    has.service.service = service;
    return local.settings.host.service.check_is_enabled(service);
};

/**
 * Check the host has a service running
 * @param {string} service The service name to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.service.running = function (service) {
    has.service.service = service;
    return local.settings.host.service.check_is_running(service);
};

/**
 * Check the properties of a hosts service
 * @param {string} service The service name to validate  
 * @param {string} property The property to check  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.service.with_property = function (service, property) {
    has.service.service = service;
    return local.settings.host.service.check_has_property(service, property);
};

// Feature Specific Functionality
has.software_package = {};

/**
 * Check the host has a software package installed
 * @param {string} soft_package The name of the software package  
 * @param {string} [version] The version to check  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.software_package = function (soft_package, version) {
    return local.settings.host.soft_package.check_is_installed(soft_package, version);
};


// User Specific Functionality
has.user = {};

/**
 * Check the host has a user added/avaialble
 * @param {string} user The username to validate  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.user = function (user) {
    has.user.username = user;
    return local.settings.host.user.check_exists(user);
};

/**
 * Check the host has a user who belongs to a specific group
 * @param {string} user The username to validate  
 * @param {string} group The group to vlaidate against  
 * @returns {Promise} A promise - resolves ```true``` or ```false``` 
 */
has.user.who_belongs_to_group = function (user, group) {
    if (group === undefined && has.user.username !== undefined) {
        // Use the last username instead
        group = user;
        user = has.user.username;
    }

    return local.settings.host.user.check_belongs_to_group(user, group);
};


