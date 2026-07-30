var DOMConsole = function (showTimestamps) {
    document.getElementById('console').style.display = 'block';

    if (typeof console === "undefined") console = {};
    console.olog = console.log || function () { };
    console.owarn = console.warn || function () { };
    console.oerror = console.error || function () { };
    console.oinfo = console.info || function () { };
    console.odebug = console.debug || function () { };

    function appendLog(message, color) {
        var p = document.createElement('p');
        if (showTimestamps) {
            var date = new Date();
            p.textContent = date.getMonth() + 1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ' - ' + message;
        } else {
            p.textContent = message;
        }
        p.style.color = color;
        p.className = "animated fadeIn";
        document.getElementById('console').appendChild(p);
        document.getElementById('console').scrollTop = document.getElementById('console').scrollHeight;
    }

    console.log = function (message) {
        console.olog(message);
        appendLog(message);
    };

    console.warn = function (message) {
        console.owarn(message);
        appendLog(message, 'yellow');
    };

    console.error = function (message) {
        console.oerror(message);
        appendLog(message, 'red');
    };

    console.info = function (message) {
        console.oinfo(message);
        appendLog(message, 'cyan');
    };

    console.debug = function (message) {
        console.odebug(message);
        appendLog(message, 'gray');
    };

    // CONSOLE ERROR HANDLER
    window.onerror = function (error, url, line) {
        console.error('JS Error: ' + error + ' @ ' + url + ':' + line);
    };
};