import Router from '@koa/router'
import tokenMiddleware from '../token'

const teacherRouter = new Router({ prefix: '/teachers' })

teacherRouter.use(tokenMiddleware)

teacherRouter.use((ctx) => ctx.throw(501))

export default teacherRouter
