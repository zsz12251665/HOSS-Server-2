import Router from '@koa/router'

const taskRouter = new Router({ prefix: '/tasks' })

taskRouter.use((ctx) => ctx.throw(501))

export default taskRouter
