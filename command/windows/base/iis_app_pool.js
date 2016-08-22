var iis_app_pool = function () { };

function exec(cmd) {
    const script = 'find_iis_component.ps1';
    return this.base.exec(cmd, script);
}

iis_app_pool.prototype.check_exists = function (name) {
    return exec.call(this, `@(FindIISAppPool -name '${name}').count -gt 0`);
};

iis_app_pool.prototype.check_has_dotnet_version = function (name, dotnet) {
    return exec.call(this, `(FindIISAppPool -name '${name}').managedRuntimeVersion -match 'v${dotnet}'`);
};

iis_app_pool.prototype.check_has_32bit_enabled = function (name) {
    return exec.call(this, `(FindIISAppPool -name '${name}').enable32BitAppOnWin64 -eq $true`);
};

iis_app_pool.prototype.check_has_idle_timeout = function (name, minutes) {
    return exec.call(this, `(FindIISAppPool -name '${name}').processModel.idleTimeout.Minutes -eq ${minutes}`);
};

iis_app_pool.prototype.check_has_identity_type = function (name, type) {
    return exec.call(this, `(FindIISAppPool -name '${name}').processModel.identityType -eq '${type}'`);
};

iis_app_pool.prototype.check_has_user_profile = function (name) {
    return exec.call(this, `((FindIISAppPool -name '${name}').processModel.loadUserProfile -eq $true`);
};

iis_app_pool.prototype.check_has_username = function (name, username) {
    return exec.call(this, `(FindIISAppPool -name '${name}').processModel.username -eq '${username}'`);
};

iis_app_pool.prototype.check_has_periodic_restart = function (name, minutes) {
    return exec.call(this, `(FindIISAppPool -name '${name}').recycling.periodicRestart.time.TotalMinutes -eq ${minutes}`);
};

iis_app_pool.prototype.check_has_managed_pipeline_mode = function (name, mode) {
    return exec.call(this, `(FindIISAppPool -name '${name}').managedPipelineMode -eq '${mode}'`);
};

module.exports = new iis_app_pool();