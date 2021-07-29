require('module-alias/register');

const config = require('@config/server.json');
const express = require('express');
const cors = require('cors');
const multiparty = require('connect-multiparty');

var app = express();

app.use(cors()); // 允许跨域请求

app.use(express.urlencoded({ extended: false })); // 解析 application/x-www-form-urlencoded
app.use(express.json()); // 解析 application/json
app.use(multiparty()); // 解析 multipart/form-data

app.use(express.static('static')); // 访问静态资源

app.use('/api', require('./router')); // 设定转发路由器

app.use((req, res, next) => next({ status: 404, message: `${req.method} ${req.url} not found!` })); // 资源未找到

app.use((err, req, res, next) => { // 处理错误
	res.status(err.status || 500).type('text/plain').send(err.message);
	return next; // Useless statement
});

var server = app.listen(config.port, () => { // 开始监听
	console.log('App running at port %d', server.address().port);
});
