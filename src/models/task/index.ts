import Router from '@koa/router'
import tokenMiddleware from '../token'

const taskRouter = new Router({ prefix: '/tasks' })

taskRouter.use(tokenMiddleware)

taskRouter.use((ctx) => ctx.throw(501))

export default taskRouter
