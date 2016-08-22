var registry_key = function () {};

registry_key.prototype.check_exists = function (key_name) {
    var cmd = `(Get-Item 'Registry::${key_name}') -ne $null`;
    return this.base.exec(cmd);

};

// Todo: Finish implementation

module.exports = new registry_key();

