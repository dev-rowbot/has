baseParams = {};

function exec (cmd) {
    const script = 'find_iis_component.ps1';
    return baseParams.exec (cmd, script);
}

function check_exists (name) {
    return exec (`@(FindIISAppPool -name '${name}').count -gt 0`);    
}

function check_has_dotnet_version (name, dotnet) {
    return exec (`(FindIISAppPool -name '${name}').managedRuntimeVersion -match 'v${dotnet}'`);    
}

function check_has_32bit_enabled (name) {
    return exec (`(FindIISAppPool -name '${name}').enable32BitAppOnWin64 -eq $true`);    
}

function check_has_idle_timeout (name, minutes) {
    return exec (`(FindIISAppPool -name '${name}').processModel.idleTimeout.Minutes -eq ${minutes}`);    
}

function check_has_identity_type (name, type) {
    return exec (`(FindIISAppPool -name '${name}').processModel.identityType -eq '${type}'`);    
}

function check_has_user_profile (name) {
    return exec (`((FindIISAppPool -name '${name}').processModel.loadUserProfile -eq $true`);    
}

function check_has_username (name, username) {
    return exec (`(FindIISAppPool -name '${name}').processModel.username -eq '${username}'`);    
}

function check_has_periodic_restart (name, minutes) {
    return exec (`(FindIISAppPool -name '${name}').recycling.periodicRestart.time.TotalMinutes -eq ${minutes}`);    
}

function check_has_managed_pipeline_mode (name, mode) {
    return exec (`(FindIISAppPool -name '${name}').managedPipelineMode -eq '${mode}'`);    
}

function setParams (params) {
    baseParams = params;    
}

module.exports = {
    setParams: setParams,
    check_exists: check_exists,
    check_has_dotnet_version: check_has_dotnet_version,
    check_has_32bit_enabled: check_has_32bit_enabled,
    check_has_idle_timeout: check_has_idle_timeout,
    check_has_identity_type: check_has_identity_type,
    check_has_username: check_has_username,
    check_has_periodic_restart: check_has_periodic_restart,
    check_has_managed_pipeline_mode: check_has_managed_pipeline_mode
};