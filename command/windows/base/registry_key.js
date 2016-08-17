baseParams = {};

function check_exists(key_name) {
    var cmd = `(Get-Item 'Registry::${key_name}') -ne $null`;
    return baseParams.exec(cmd);

}

// Todo: Finish implementation

function setParams(params) {
    baseParams = params;
}

module.exports = {
    setParams: setParams,
    check_exists: check_exists,
};

