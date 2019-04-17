const http = require('http');
const fs = require('fs');

http.createServer(function(req, res) {
    // 读取二进制demo
    let file = fs.readFileSync('test.jpg');
    // 首页显示
    if (req.url == '/' && req.method.toLowerCase() == 'get') {
        res.writeHead(200, {'content-type': 'text/html'});

        fs.readFile('view/index.html',function(err, data){
            if (err) {
                console.log('error');
            } else {
                res.end(data);
            }
        });
    }
    // arraybuffer 和 blob，实际返回的是相同的二进制内容
    if ('/arraybuffer' === req.url || '/blob' === req.url) {
        res.write(file);
        res.end();
    }
}).listen(8080);