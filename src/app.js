const config = require('./config/server.json');
const express = require('express');
const cors = require('cors');
const multipart = require('connect-multiparty');

var app = express();

app.use(cors()); // 允许跨域请求

app.use(express.urlencoded({ extended: false })); // 解析 application/x-www-form-urlencoded
app.use(express.json()); // 解析 application/json
app.use(multipart()); // 解析 multipart/form-data

app.use(express.static('static')); // 访问静态资源

app.use('/api', require('./router')); // 设定转发路由器

var server = app.listen(config.port, () => { // 开始监听
	console.log('App running at port %d', server.address().port);
});
