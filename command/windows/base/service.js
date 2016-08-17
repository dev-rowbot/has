baseParams = {};

function check_is_installed(service) {
    const script = 'find_service.ps1';
    var cmd = `@(FindService -name '${service}').count -gt 0`;
    return baseParams.exec(cmd, script);
}

function check_has_start_mode(service, mode) {
    const script = 'find_service.ps1';
    var cmd = `'${mode}' -match (FindService -name '${service}').StartMode -and (FindService -name '${service}') -ne $null`;
    return baseParams.exec(cmd, script);
}

function check_is_enabled(service, level) {
    const script = 'find_service.ps1';
    var cmd = `(FindService -name '${service}').StartMode -eq 'Auto'`;
    return baseParams.exec(cmd, script);
}

function check_is_running(service) {
    const script = 'find_service.ps1';
    var cmd = `(FindService -name '${service}').State -eq 'Running'`;
    return baseParams.exec(cmd, script);
}

// Todo: Figure out how this is used - probably best to use it as
// {TagId: Value; Priority: "value"}
// And then create one large command for all values
function check_has_property(service, property) {
    const script = 'find_service.ps1';
    var cmd = [];

    throw "Not Implemented"
    
    return baseParams.exec(cmd, script);
}

function setParams(params) {
    baseParams = params;
}

module.exports = {
    setParams: setParams,
    check_is_installed: check_is_installed,
    check_has_start_mode: check_has_start_mode,
    check_is_enabled: check_is_enabled,
    check_is_running: check_is_running,
    check_has_property: check_has_property,
};

