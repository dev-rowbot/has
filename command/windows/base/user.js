baseParams = {};

function check_exists(user) {
    const script = 'find_user.ps1';
    var cmd = '';
    var group_info = {};

    // need to get group_id from windows account
    group_info = baseParams.windows_account(user);

    if (group_info.domain === undefined) {
        cmd = `(FindUser -userName \'${group_info.name}\') -ne $null`;
    } else {
        cmd = `(FindGroup -userName \'${group_info.name}\' -domain \'${group_info.domain}\') -ne $null`;
    }
    return baseParams.exec(cmd, script);

}

function check_belongs_to_group(user, group) {
    const script = ['find_user.ps1',
        'find_group.ps1',
        'find_usergroup.ps1'];
    var cmd = '';
    var group_info = {};
    var user_domain = '';
    var group_domain = '';

    // need to get group_id from windows account
    user_info = baseParams.windows_account(user);
    group_info = baseParams.windows_account(group);

    if (user_info.domain !== undefined) {
        user_domain = ` -userDomain '${user_info.domain}'`;
    }

    if (group_info.domain !== undefined) {
        group_domain = ` -groupDomain '${group_info.domain}'`;
    }

    cmd = `(FindUserGroup -userName '${user_info.name}'${user_domain} -groupName '${group_info.name}'${group_domain}) -ne $null`;

    return baseParams.exec(cmd, script);

}

function setParams(params) {
    baseParams = params;
}

module.exports = {
    setParams: setParams,
    check_exists: check_exists,
    check_belongs_to_group: check_belongs_to_group
};
