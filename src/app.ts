import 'module-alias/register'
import ORM from '@/ORM'
import config from '@config/app.json'
import cors from '@koa/cors'
import Koa from 'koa'
import bodyParser from 'koa-body'
import staticResources from 'koa-static'
import router from './models'

var app = new Koa()

app.use(cors()) // 允许跨域请求
app.use(bodyParser({ multipart: true, formidable: { uploadDir: config.tempDir } })) // 解析请求主体
app.use(staticResources('static')) // 访问静态资源
app.use(router.routes()) // 设定路由器

ORM.init().then(() => { // 启动 ORM
	app.listen(config.port, () => console.log('App running at port %d', config.port)) // 开始监听
})
