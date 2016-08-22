var host = function () {};

host.prototype.check_is_resolvable = function (name, type) {
    var cmd = '';
    if (type == 'hosts') {
        cmd = `@(Select-String -path (Join-Path -Path $($env:windir) -ChildPath 'system32/drivers/etc/hosts') -pattern '${name}\\b').count -gt 0`;
    } else {
        cmd = `@([System.Net.Dns]::GetHostAddresses('${name}')).count -gt 0`;
    }

    return this.base.exec(cmd);
};

host.prototype.check_is_reachable = function (host, protocol, timeout, port) {
    const script = 'is_remote_port_listening.ps1';
    var cmd = '';

    if (port === undefined) {
        cmd = `(New-Object System.Net.NetworkInformation.Ping).send('${host}').Status -eq 'Success'`;
        return this.base.exec(cmd);
    }

    cmd = `(IsRemotePortListening -hostname ${host} -port ${port} -timeout ${timeout} -proto ${protocol}) -eq $true`;
    return this.base.exec(cmd, script);
};

module.exports = new host();