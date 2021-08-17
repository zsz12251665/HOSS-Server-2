import Router from '@koa/router'

const teacherRouter = new Router({ prefix: '/teachers' })

teacherRouter.use((ctx) => ctx.throw(501))

export default teacherRouter
