var registry_key = function () {};

registry_key.prototype.check_exists = function (key_name) {
    var cmd = `(Get-Item 'Registry::${key_name}') -ne $null`;
    return this.base.exec(cmd);

};

registry_key.prototype.check_has_value = function (key_name, key_property, key_value) {
    // Specinfra uses this command but it only returns True when there is a match and empty for no match
    //var cmd = `(Compare-Object (Get-Item 'Registry::${key_name}').GetValue('${key_property}') ${key_value}) -eq $null`;
    // This command will always return true or false (or so I believe). A bad key input will also return false
    // so that may be incorrect if you ar elooking for false...
    var cmd = `(Get-Item 'Registry::${key_name}').GetValue('${key_property}') -eq '${key_value}'`;
    return this.base.exec(cmd);
};

registry_key.prototype.check_has_property = function (key_name, key_property, key_type) {
    var cmd = `(Get-Item 'Registry::${key_name}').GetValueKind('${key_property}') -eq '${key_type}'`;
    return this.base.exec(cmd);
};

module.exports = new registry_key();

