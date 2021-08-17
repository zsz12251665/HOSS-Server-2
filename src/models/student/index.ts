import Router from '@koa/router'

const studentRouter = new Router({ prefix: '/students' })

studentRouter.use((ctx) => ctx.throw(501))

export default studentRouter
