var file = function () { };

/* Private Functions */
function has_attribute(item, attribute) {
    return `((Get-Item -Path "${item}" -Force).attributes.ToString() -Split ', ') -contains '${attribute}'`
}

function get_identity(by_whom) {
    if (by_whom !== 'owner' || by_whom !== 'user' || by_whom !== 'group') {
        throw "You must provide a specific Windows user/group - Expected owner/user/group ";
    }
}

/* Exported Functions */
file.prototype.check_exists = function (file) {
    var cmd = `Test-Path -Path "${file}"`;

    console.log('FILE: ' + this.name + ' ==> ' + this.base.name + ' ==> XXX');
    //console.log(this.base.winrmParams);
    //console.log('COMP: ' + (this.base.exec === this.base.exec ? "true" : "false"));

    return this.base.exec(cmd);

};

file.prototype.check_is_file = function (file) {
    var cmd = has_attribute(file, 'Archive');

    return this.base.exec(cmd);

};

file.prototype.check_is_directory = function (dir) {
    var cmd = has_attribute(dir, 'Directory');

    return this.base.exec(cmd);

};

file.prototype.check_is_hidden = function (file) {
    var cmd = has_attribute(file, 'Hidden');

    return this.base.exec(cmd);

};

file.prototype.check_is_readonly = function (file) {
    var cmd = has_attribute(file, 'ReadOnly');

    return this.base.exec(cmd);

};

file.prototype.check_is_system = function (file) {
    var cmd = has_attribute(file, 'System');

    return this.base.exec(cmd);

};

file.prototype.get_content = function (file) {
    var cmd = `Get-Content("${file}") | Write-Host`;

    return this.base.exec(cmd);

};

file.prototype.get_md5sum = function (file) {
    var cmd = ` $md5 = New-Object -TypeName System.Security.Cryptography.MD5CryptoServiceProvider \n` +
        ` $sum = [System.BitConverter]::ToString($md5.ComputeHash([System.IO.File]::ReadAllBytes("${file}"))) \n` +
        ` echo $sum.ToLower().Replace("-","") \n`;
    return this.base.exec(cmd);

};

file.prototype.check_is_accessible_by_user = function (file, user, access) {
    switch (access) {
        case 'r':
            {
                check_is_readable = (file, user);
                break;
            }
        case 'w':
            {
                check_is_writeable = (file, user);
                break;
            }
        case 'x':
            {
                check_is_executable = (file, user);
                break;
            }
    }

};

file.prototype.check_is_readable = function (file, by_whom) {
    const script = 'check_file_access_rules.ps1';
    get_identity(by_whom);
    cmd = `CheckFileAccessRules -path '${file}' -identity '${by_whom}' -rules @('FullControl', 'Modify', 'ReadAndExecute', 'Read', 'ListDirectory')`;
    return this.base.exec(cmd, script);
};

file.prototype.check_is_writeable = function (file, by_whom) {
    const script = 'check_file_access_rules.ps1';
    get_identity(by_whom);
    cmd = `CheckFileAccessRules -path '${file}' -identity '${by_whom}' -rules @('FullControl', 'Modify', 'Write')`;
    return this.base.exec(cmd, script);
};

file.prototype.check_is_executable = function (file, by_whom) {
    const script = 'check_file_access_rules.ps1';
    get_identity(by_whom);
    cmd = `CheckFileAccessRules -path '${file}' -identity '${by_whom}' -rules @('FullControl', 'Modify', 'ReadAndExecute', 'ExecuteFile')`;
    return this.base.exec(cmd, script);
};

file.prototype.check_contains = function (file, pattern) {
    // todo - we need to port the convert_regexp code here and use ${convert_regexp(pattern)} 
    var cmd = `(Get-Content("${file}") | Out-String) -match '${pattern}'`;

    return this.base.exec(cmd);
};

file.prototype.check_contains_within = function (file, pattern, from, to) {
    // todo - we need to port the convert_regexp code here and use ${convert_regexp(to)} and ${convert_regexp(from)} 
    var from = from || '^';
    var to = to || '$';

    const script = 'crop_text.ps1';
    var cmd = `(CropText -text (Get-Content("${file}") | Out-String) -fromPattern '${from}' -toPattern '${to}') -match '${pattern}'`;

    return this.base.exec(cmd, script);
};

file.prototype.check_has_version = function (name, version) {
    var cmd = `((Get-Command '${name}').FileVersionInfo.ProductVersion -eq '${version}') -or ((Get-Command '${name}').FileVersionInfo.FileVersion -eq '${version}')`;

    return this.base.exec(cmd);
};

file.prototype.check_is_owned_by = function (file, owner) {
    var cmd = `$(if((Get-Item '${file}').GetAccessControl().Owner -match '${owner}' -or ((Get-Item '${file}').GetAccessControl().Owner -match '${owner}').Length -gt 0){ $TRUE } else { $FALSE })`;

    return this.base.exec(cmd);
};

module.exports = new file();

