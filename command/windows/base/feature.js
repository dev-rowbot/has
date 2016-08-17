baseParams = {};

function check_is_enabled(name, provider) {
    const script = 'list_windows_features.ps1';
    var cmd = '';
    if (typeof provider === 'undefined') {
        cmd = `@(ListWindowsFeatures -feature ${name}).count -gt 0`;
    } else {
        cmd = `@(ListWindowsFeatures -feature ${name} -provider ${provider}).count -gt 0`;
    }
    return baseParams.exec(cmd, script);

}

function setParams(params) {
    baseParams = params;
}

module.exports = {
    setParams: setParams,
    check_is_enabled: check_is_enabled
};

