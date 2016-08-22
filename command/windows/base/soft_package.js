var soft_package = function () {};

soft_package.prototype.check_is_installed = function (soft_package, version) {
    const script = 'find_installed_application.ps1';
    var cmd = '';
    package_version = '';
    if (typeof version !== 'undefined') {
        package_version = `-appVersion '${version}'`;
    }
    cmd = `(FindInstalledApplication -appName '${soft_package}' ${package_version}) -eq $true`;
    return this.base.exec(cmd, script);

};

module.exports = new soft_package();
