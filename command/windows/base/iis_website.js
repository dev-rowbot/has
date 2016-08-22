var iis_website = function () { };

iis_website.prototype.check_is_enabled = function (name) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindIISWebsite -name '${name}').serverAutoStart -eq $true`;

    return this.base.exec(cmd, script);
};

iis_website.prototype.check_is_installed = function (name) {
    const script = 'find_iis_component.ps1';
    var cmd = `@(FindIISWebsite -name '${name}').count -gt 0`;

    return this.base.exec(cmd, script);
};

iis_website.prototype.check_is_running = function (name) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindIISWebsite -name '${name}').state -eq 'Started'`;

    return this.base.exec(cmd, script);
};

iis_website.prototype.check_is_in_app_pool = function (name, app_pool) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindIISWebsite -name '${name}').applicationPool -match '${app_pool}'`;

    return this.base.exec(cmd, script);
};

iis_website.prototype.check_has_physical_path = function (name, path) {
    const script = 'find_iis_component.ps1';
    var cmd = `[System.Environment]::ExpandEnvironmentVariables( ( FindIISWebsite -name '${name}' ).physicalPath ).replace('\\', '/' ) -eq ('${path}'.trimEnd('/').replace('\\', '/'))`;

    return this.base.exec(cmd, script);
};

iis_website.prototype.check_has_site_bindings = function (name, port, protocol, ipaddress, host_header) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindSiteBindings -name '${name}' -protocol '${protocol}' -hostHeader '${host_header}' -port ${port} -ipAddress '${ipaddress}').count -gt 0`;

    return this.base.exec(cmd, script);
};

iis_website.prototype.check_has_virtual_dir = function (name, vdir, path) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindSiteVirtualDir -name '${name}' -vdir '${vdir}' -path '${path}') -eq $true`;

    return this.base.exec(cmd, script);
};

iis_website.prototype.check_has_site_application = function (name, app, pool, physical_path) {
    const script = 'find_iis_component.ps1';
    var cmd = `(FindSiteApplication -name '${name}' -app '${app}' -pool '${pool}' -physicalPath '${physical_path}') -eq $true`;

    return this.base.exec(cmd, script);
};

module.exports = new iis_website();

