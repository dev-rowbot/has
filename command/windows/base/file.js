baseParams = {};

/* Private Functions */
function has_attribute (item, attribute) {
    return `((Get-Item -Path "${item}" -Force).attributes.ToString() -Split ', ') -contains '${attribute}'`
}

function get_identity (by_whom) {
    if (by_whom !== 'owner' || by_whom !== 'user' ||  by_whom !== 'group') {
        throw "You must provide a specific Windows user/group - Expected owner/user/group ";
    }
}

/* Exported Functions */
function check_exists(file) {
    var cmd = `Test-Path -Path "${file}"`;

    return baseParams.exec(cmd);

}

function check_is_file(file) {
    var cmd = has_attribute(file, 'Archive');

    return baseParams.exec(cmd);

}

function check_is_directory(dir) {
    var cmd = has_attribute(dir, 'Directory');

    return baseParams.exec(cmd);

}

function check_is_hidden(file) {
    var cmd = has_attribute(file, 'Hidden');

    return baseParams.exec(cmd);

}

function check_is_readonly(file) {
    var cmd = has_attribute(file, 'ReadOnly');

    return baseParams.exec(cmd);

}

function check_is_system(file) {
    var cmd = has_attribute(file, 'System');

    return baseParams.exec(cmd);

}

function get_content(file) {
    var cmd = `Get-Content("${file}") | Write-Host`;

    return baseParams.exec(cmd);

}

function get_md5sum(file) {
    var cmd = ` $md5 = New-Object -TypeName System.Security.Cryptography.MD5CryptoServiceProvider \n` + 
              ` $sum = [System.BitConverter]::ToString($md5.ComputeHash([System.IO.File]::ReadAllBytes("${file}"))) \n` +
              ` echo $sum.ToLower().Replace("-","") \n`;
    return baseParams.exec(cmd);

}

function check_is_accessible_by_user (file, user, access) {
    switch (access) {
        case 'r':
        {
            check_is_readable(file, user);
        }
        case 'w':
        {
            check_is_writeable(file, user);
        }
        case 'x':
        {
            check_is_executable(file, user);
        }
    }

}

function check_is_readable (file, by_whom) {
    const script = 'check_file_access_rules.ps1';
    get_identity(by_whom);
    cmd = `CheckFileAccessRules -path '${file}' -identity '${by_whom}' -rules @('FullControl', 'Modify', 'ReadAndExecute', 'Read', 'ListDirectory')`;
    return baseParams.exec(cmd, script);
}

function check_is_writeable (file, by_whom) {
    const script = 'check_file_access_rules.ps1';
    get_identity(by_whom);
    cmd = `CheckFileAccessRules -path '${file}' -identity '${by_whom}' -rules @('FullControl', 'Modify', 'Write')`;
    return baseParams.exec(cmd, script);
}

function check_is_executable (file, by_whom) {
    const script = 'check_file_access_rules.ps1';
    get_identity(by_whom);
    cmd = `CheckFileAccessRules -path '${file}' -identity '${by_whom}' -rules @('FullControl', 'Modify', 'ReadAndExecute', 'ExecuteFile')`;
    return baseParams.exec(cmd, script);
}

function check_contains (file, pattern) {
    // todo - we need to port the convert_regexp code here and use ${convert_regexp(pattern)} 
    var cmd = `(Get-Content("${file}") | Out-String) -match '${pattern}'`;

    return baseParams.exec(cmd);    
}

function check_contains_within (file, pattern, from, to) {
    // todo - we need to port the convert_regexp code here and use ${convert_regexp(to)} and ${convert_regexp(from)} 
    var from = from || '^';
    var to = to || '$';

    const script = 'crop_text.ps1';
    var cmd = `(CropText -text (Get-Content("${file}") | Out-String) -fromPattern '${from}' -toPattern '${to}') -match '${pattern}'`;

    return baseParams.exec(cmd, script);    
}

function check_has_version (name, version) {
    var cmd = `((Get-Command '${name}').FileVersionInfo.ProductVersion -eq '${version}') -or ((Get-Command '${name}').FileVersionInfo.FileVersion -eq '${version}')`;

    return baseParams.exec(cmd);      
}

function check_is_owned_by (file, owner) {
    var cmd = `$(if((Get-Item '${file}').GetAccessControl().Owner -match '${owner}' -or ((Get-Item '${file}').GetAccessControl().Owner -match '${owner}').Length -gt 0){ $TRUE } else { $FALSE })`;

    return baseParams.exec(cmd);      
}

function setParams (params) {
    baseParams = params;    
}

module.exports = {
    setParams: setParams,
    check_exists: check_exists,
    check_is_file: check_is_file,
    check_is_directory: check_is_directory,
    check_is_hidden: check_is_hidden,
    check_is_readonly: check_is_readonly,
    check_is_system: check_is_system,
    get_content: get_content,
    get_md5sum: get_md5sum,
    check_is_accessible_by_user: check_is_accessible_by_user,
    check_has_version: check_has_version,
    check_contains: check_contains,
    check_contains_within: check_contains_within,
    check_is_owned_by: check_is_owned_by,
};


