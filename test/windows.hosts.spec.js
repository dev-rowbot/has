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
    describe ("Playbook ensure-filebeat", function () {
        // Requires some knowledge of what happened during the ansible "deploy"
        // Filebeat is not a regular installation so we just look for the exe first
        // and then check if Windows knows about the service
        describe (`${hostname} Ensure Filebeat is installed`, function () {
                it("should be true", function (done) {
                    has.file.which_is_a_directory('C:\\ProgramData\\chocolatey\\lib\\filebeat\\tools\\filebeat-1.2.3-windows').then(function (result) {
                        expect(result).toBe(true);
                        done();
                    }, function(result) {
                        expect(result.message).toBe(true);
                        done();
                    });
                }, DEFAULT_TIMEOUT);
        });
        describe (`${hostname} Ensure Filebeat Service is installed`, function () {
                it("should be true", function (done) {
                    has.service.installed('filebeat').then(function (result) {
                        expect(result).toBe(true);
                        done();
                    }, function(result) {
                        expect(result.message).toBe(true);
                        done();
                    });
                }, DEFAULT_TIMEOUT);
        });
        describe (`${hostname} Ensure filebeat service is Stopped`, function () {
                it("should be true", function (done) {
                    has.service.running('filebeat').then(function (result) {
                        expect(result).toBe(false);
                        done();
                    }, function(result) {
                        expect(result.message).toBe(true);
                        done();
                    });
                }, DEFAULT_TIMEOUT);
        });
        describe (`${hostname} Ensure filebeat service start mode is auto`, function () {
                it("should be true", function (done) {
                    has.service.with_start_mode('filebeat', 'Auto').then(function (result) {
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


