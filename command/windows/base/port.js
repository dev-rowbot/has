var port = function () {};
 
port.prototype.check_is_listening = function (port) {
    const script = 'is_port_listening.ps1';
    var cmd = '';
    cmd = `IsPortListening -portNumber ${port}`;

    return this.base.exec(cmd, script);
};

port.prototype.check_is_listening_with_protocol = function (port, protocol) {
    const script = 'is_port_listening.ps1';
    var cmd = '';
    cmd = `IsPortListening -portNumber ${port} -protocol '${protocol}'`;

    return this.base.exec(cmd, script);
};

module.exports = new port();