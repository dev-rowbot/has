baseParams = {};

function check_is_installed(soft_package, version) {
    const script = 'find_installed_application.ps1';
    var cmd = '';
    package_version = '';
    if (typeof version !== 'undefined') {
        package_version = `-appVersion '${version}'`;
    }
    cmd = `(FindInstalledApplication -appName '${soft_package}' ${package_version}) -eq $true`;
    return baseParams.exec(cmd, script);

}

function setParams (params) {
    baseParams = params;    
}

module.exports = {
    setParams: setParams,
    check_is_installed: check_is_installed
};
