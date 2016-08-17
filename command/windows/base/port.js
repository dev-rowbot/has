baseParams = {};

function check_is_listening(port) {
    const script = 'is_port_listening.ps1';
    var cmd = '';
    cmd = `IsPortListening -portNumber ${port}`;

    return baseParams.exec(cmd, script);
}

function check_is_listening_with_protocol(port, protocol) {
    const script = 'is_port_listening.ps1';
    var cmd = '';
    cmd = `IsPortListening -portNumber ${port} -protocol '${protocol}'`;

    return baseParams.exec(cmd, script);
}

function setParams(params) {
    baseParams = params;
}

module.exports = {
    setParams: setParams,
    check_is_listening: check_is_listening,
    check_is_listening_with_protocol: check_is_listening_with_protocol
};