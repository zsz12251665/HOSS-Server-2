import 'module-alias/register'
import express from 'express'
import cors from 'cors'
import config from '@config/server.json'
import router from '@src/router'

var app = express()
app.use(cors()) // 允许跨域请求
app.use(express.urlencoded({ extended: false })) // 解析 application/x-www-form-urlencoded
app.use(express.json()) // 解析 application/json

app.use(express.static('static')) // 访问静态资源
app.use('/api', router) // 设定转发路由器

app.listen(config.port, () => console.log('App running at port %d', config.port)) // 开始监听
