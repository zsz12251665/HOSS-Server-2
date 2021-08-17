import Router from '@koa/router'

const courseRouter = new Router({ prefix: '/courses' })

courseRouter.use((ctx) => ctx.throw(501))

export default courseRouter
