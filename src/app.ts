import 'module-alias/register'
import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-body'
import staticResources from 'koa-static'
import config from '@config/server.json'
import router from '@src/router'
import ORM from '@/ORM'
import { MikroORM } from '@mikro-orm/core'

var app = new Koa()
	.use(cors()) // 允许跨域请求
	.use(bodyParser({ multipart: true })) // 解析请求主体
	.use(staticResources('static')) // 访问静态资源
	.use(router.routes()) // 设定转发路由器

ORM().then((orm: MikroORM) => { // 启动 ORM
	app.context.orm = orm
	app.context.em = orm.em
	app.listen(config.port, () => console.log('App running at port %d', config.port)) // 开始监听
})
