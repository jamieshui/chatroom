var ws = require('nodejs-websocket');

var server = ws.createServer(function(conn) {
    console.log('New Connection');

    conn.on('text', function(str) {
        console.log(str);

        // conn.sendText(str);

        // boardcast(str);

        var data = JSON.parse(str);
        switch (data.type) {
            case 'setname':
                conn.nickname = data.name;
                boardcast(JSON.stringify({
                    name: 'Sever',
                    text: data.name + '加入了房间'
                }));
                break;
            case 'chat':
                boardcast(JSON.stringify({
                    name: conn.nickname,
                    text: data.text
                }));
                break;
            default:
                break;
        }
    });
    // setTimeout(function() {
    //     conn.sendText('来自服务端的消息');
    // }, 5000);

    conn.on('close', function() {
        boardcast(JSON.stringify({
            name: 'Sever',
            text: conn.nickname + '离开了房间'
        }));
    })

    conn.on('error', function(err) {
        console.log(err);
    })

}).listen(2333);

function boardcast(str) {
    server.connections.forEach(function(conn) {
        conn.sendText(str);
    })
}