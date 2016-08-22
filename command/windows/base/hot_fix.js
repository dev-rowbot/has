var hotfix = function () { };

// todo: The hotfix script returns a lot of debug which is not required, need to cleanup
// so that only True or False is returned

hotfix.prototype.check_is_installed = function (description, hot_fix_id) {
    const script = 'find_installed_hot_fix.ps1';

    var hot_fix_id_match = description.match(/(KB\d+)/i);
    if (hot_fix_id === undefined) {
        hot_fix_id = hot_fix_id_match ? hot_fix_id_match[1] : description;
    }

    var cmd = `(FindInstalledHotFix -description "${description}" -hotFixId "${hot_fix_id}" -eq $true)`;

    return this.base.exec(cmd, script);

};

module.exports = new hotfix();

