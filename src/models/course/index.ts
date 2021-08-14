import Router from '@koa/router'
import tokenMiddleware from '../token'

const courseRouter = new Router({ prefix: '/courses' })

courseRouter.use(tokenMiddleware)

courseRouter.use((ctx) => ctx.throw(501))

export default courseRouter
