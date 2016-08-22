var feature = function () { };

feature.prototype.check_is_enabled = function (name, provider) {
    const script = 'list_windows_features.ps1';
    var cmd = '';
    if (typeof provider === 'undefined') {
        cmd = `@(ListWindowsFeatures -feature ${name}).count -gt 0`;
    } else {
        cmd = `@(ListWindowsFeatures -feature ${name} -provider ${provider}).count -gt 0`;
    }
    return this.base.exec(cmd, script);

};

module.exports = new feature();

