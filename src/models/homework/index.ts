import Router from '@koa/router'

const homeworkRouter = new Router({ prefix: '/homeworks' })

homeworkRouter.get('/')
homeworkRouter.patch('/')

homeworkRouter.get('/:studentID')
homeworkRouter.patch('/:studentID')

homeworkRouter.get('/:studentID/file')
homeworkRouter.put('/:studentID/file')
homeworkRouter.delete('/:studentID/file')

homeworkRouter.use((ctx) => ctx.throw(501))

export default homeworkRouter
