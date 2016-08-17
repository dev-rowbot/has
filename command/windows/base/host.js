baseParams = {};

function check_is_resolvable(name, type) {
    var cmd = '';
    if (type == 'hosts') {
        cmd = `@(Select-String -path (Join-Path -Path $($env:windir) -ChildPath 'system32/drivers/etc/hosts') -pattern '${name}\\b').count -gt 0`;
    } else {
        cmd = `@([System.Net.Dns]::GetHostAddresses('${name}')).count -gt 0`;
    }

    return baseParams.exec(cmd);
}

function check_is_reachable(host, protocol, timeout, port) {
    const script = 'is_remote_port_listening.ps1';
    var cmd = '';

    if (port === undefined) {
        cmd = `(New-Object System.Net.NetworkInformation.Ping).send('${host}').Status -eq 'Success'`;
        return baseParams.exec(cmd);
    }

    cmd = `(IsRemotePortListening -hostname ${host} -port ${port} -timeout ${timeout} -proto ${protocol}) -eq $true`;
    return baseParams.exec(cmd, script);
}

function setParams(params) {
    baseParams = params;
}

module.exports = {
    setParams: setParams,
    check_is_resolvable: check_is_resolvable,
    check_is_reachable: check_is_reachable
};