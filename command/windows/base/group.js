var group = function () { };

group.prototype.check_exists = function (group) {
    const script = 'find_group.ps1';
    var cmd = '';
    var group_info = {};

    // need to get group_id from windows account
    group_info = this.base.windows_account(group);

    if (group_info.domain === undefined) {
        cmd = `(FindGroup -groupName \'${group_info.name}\') -ne $null`;
    } else {
        cmd = `(FindGroup -groupName \'${group_info.name}\' -domain \'${group_info.domain}\') -ne $null`;
    }

    return this.base.exec(cmd, script);

};

module.exports = new group();


