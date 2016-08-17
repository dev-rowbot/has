baseParams = {};

function check_exists(group) {
    const script = 'find_group.ps1';
    var cmd = '';
    var group_info = {};

    // need to get group_id from windows account
    group_info = baseParams.windows_account(group);
 
    if (group_info.domain === undefined) {
        cmd = `(FindGroup -groupName \'${group_info.name}\') -ne $null`;
    } else {
        cmd = `(FindGroup -groupName \'${group_info.name}\' -domain \'${group_info.domain}\') -ne $null`;
    }

    return baseParams.exec(cmd, script);

}

function setParams (params) {
    baseParams = params;    
}

module.exports = {
    setParams: setParams,
    check_exists: check_exists
};


