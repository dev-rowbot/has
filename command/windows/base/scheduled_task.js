var scheduled_task = function () {};

scheduled_task.prototype.check_exists = function (name) {
    const script = 'find_scheduled_task.ps1';
    var cmd = `(FindScheduledTask -name '${name}').TaskName -eq '\\${name}'`;
    return this.base.exec(cmd, script);

};

module.exports = new scheduled_task();

