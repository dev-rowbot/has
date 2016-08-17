baseParams = {};

function check_is_enabled(name) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindIISWebsite -name '${name}').serverAutoStart -eq $true`;

    return baseParams.exec(cmd, script);
}

function check_is_installed(name) {
    const script = 'find_iis_component.ps1';
    var cmd = `@(FindIISWebsite -name '${name}').count -gt 0`;

    return baseParams.exec(cmd, script);
}

function check_is_running(name) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindIISWebsite -name '${name}').state -eq 'Started'`;

    return baseParams.exec(cmd, script);
}

function check_is_in_app_pool(name, app_pool) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindIISWebsite -name '${name}').applicationPool -match '${app_pool}'`;

    return baseParams.exec(cmd, script);
}

function check_has_physical_path(name, path) {
    const script = 'find_iis_component.ps1';
    var cmd = `[System.Environment]::ExpandEnvironmentVariables( ( FindIISWebsite -name '${name}' ).physicalPath ).replace('\\', '/' ) -eq ('${path}'.trimEnd('/').replace('\\', '/'))`;

    return baseParams.exec(cmd, script);
}

function check_has_site_bindings(name, port, protocol, ipaddress, host_header) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindSiteBindings -name '${name}' -protocol '${protocol}' -hostHeader '${host_header}' -port ${port} -ipAddress '${ipaddress}').count -gt 0`;

    return baseParams.exec(cmd, script);
}

function check_has_virtual_dir(name, vdir, path) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindSiteVirtualDir -name '${name}' -vdir '${vdir}' -path '${path}') -eq $true`;

    return baseParams.exec(cmd, script);
}

function check_has_site_application(name, app, pool, physical_path) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindSiteApplication -name '${name}' -app '${app}' -pool '${pool}' -physicalPath '${physical_path}') -eq $true`;

    return baseParams.exec(cmd, script);
}

function setParams(params) {
    baseParams = params;
}

module.exports = {
    setParams: setParams,
    check_is_enabled: check_is_enabled,
    check_is_installed: check_is_installed,
    check_is_running: check_is_running,
    check_is_in_app_pool: check_is_in_app_pool,
    check_has_physical_path: check_has_physical_path,
    check_has_site_bindings: check_has_site_bindings,
    check_has_virtual_dir: check_has_virtual_dir,
    check_has_site_application: check_has_site_application,
};

