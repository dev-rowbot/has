baseParams = {};

function check_exists(name) {
    const script = 'find_scheduled_task.ps1';
    var cmd = `(FindScheduledTask -name '${name}').TaskName -eq '\\${name}'`;
    return baseParams.exec(cmd, script);

}

function setParams(params) {
    baseParams = params;
}

module.exports = {
    setParams: setParams,
    check_exists: check_exists,
};

