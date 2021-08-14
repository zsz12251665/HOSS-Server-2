import Router from '@koa/router'
import tokenMiddleware from '../token'

const studentRouter = new Router({ prefix: '/students' })

studentRouter.use(tokenMiddleware)

studentRouter.use((ctx) => ctx.throw(501))

export default studentRouter
