var service = function () {};

service.prototype.check_is_installed = function (service) {
    const script = 'find_service.ps1';
    var cmd = `@(FindService -name '${service}').count -gt 0`;
    return this.base.exec(cmd, script);
};

service.prototype.check_has_start_mode = function (service, mode) {
    const script = 'find_service.ps1';
    var cmd = `'${mode}' -match (FindService -name '${service}').StartMode -and (FindService -name '${service}') -ne $null`;
    return this.base.exec(cmd, script);
};

service.prototype.check_is_enabled = function (service, level) {
    const script = 'find_service.ps1';
    var cmd = `(FindService -name '${service}').StartMode -eq 'Auto'`;
    return this.base.exec(cmd, script);
};

service.prototype.check_is_running = function (service) {
    const script = 'find_service.ps1';
    var cmd = `(FindService -name '${service}').State -eq 'Running'`;
    return this.base.exec(cmd, script);
};

// Todo: Figure out how this is used - probably best to use it as
// {TagId: Value; Priority: "value"}
// And then create one large command for all values
service.prototype.check_has_property = function (service, property) {
    const script = 'find_service.ps1';
    var cmd = [];

    throw "Not Implemented";
    
    return this.base.exec(cmd, script);
};

module.exports = new service();

