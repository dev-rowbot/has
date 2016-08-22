var process = function () {};

/* private functions */
function get_process_property(process, property) {
    return `Get-WmiObject Win32_Process -Filter "name = '${process}'" | select -First 1 ${property} -ExpandProperty ${property}`;
}

/* exported functions */
process.prototype.check_process = function (process) {
    var cmd = `(Get-Process '${process}') -ne $null`;
    return this.base.exec(cmd);

};

// Todo: Potential issue here, the Get-Process method does not require a file extension
// for example, VBoxTray.exe - but the Get-WmiObject requires the full name, i.e. VBoxTray.exe
process.prototype.get = function (process, opts) {
    var cmd = ``;

    switch (opts) {
        case 'pid':
            {
                cmd = get_process_property(process, 'processid');
                break;
            }
        case 'user':
            {
                cmd = `gwmi win32_process -filter "name = '${process}'" | select -first 1 | %{$_.getowner().user}`;
                break;
            }
        case 'group':
            {
                throw "Unable to get process group on Windows";
                break;
            }
        default:
            {
                cmd = get_process_property(process, opts);
                break
            }
    }

    return this.base.exec(cmd);

};

module.exports = new process();
