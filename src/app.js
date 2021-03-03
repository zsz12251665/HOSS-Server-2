const config = require('./config/server.json');
const express = require('express');
const cors = require('cors');
const multipart = require('connect-multiparty');

var app = express();
app.use(cors()); // 允许跨域请求
app.use(express.urlencoded({ extended: false })); // 解析 application/x-www-form-urlencoded
app.use(express.json()); // 解析 application/json
app.use(multipart()); // 解析 multipart/form-data

app.use('/api', require('./api/router')); // 设定 /api 的路由器

app.get('/', (req, res) => { // 服务器启动标识
	res.status(200).type('text/plain').send('It works!');
});

var server = app.listen(config.port, () => { // 开始监听
	console.log('App running at port %d', server.address().port);
});
