import 'module-alias/register'
import Koa from 'koa'
import cors from '@koa/cors'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
import config from '@config/server.json'
import router from '@src/router'

var app = new Koa()
app.use(cors()) // 允许跨域请求
app.use(koaBody({ multipart: true })) // 解析请求主体
app.use(koaStatic('static')) // 访问静态资源
app.use(router.routes()).use(router.allowedMethods()) // 设定转发路由器

app.listen(config.port, () => console.log('App running at port %d', config.port)) // 开始监听
