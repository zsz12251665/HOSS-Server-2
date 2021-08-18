import Router from '@koa/router'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as getHandler from './get'

const teacherRouter = new Router({ prefix: '/teachers' })

teacherRouter.all('/', authFilter.administratorOnly)
teacherRouter.get('/', getHandler.batch)
teacherRouter.put('/', (ctx) => ctx.throw(501))
teacherRouter.patch('/', (ctx) => ctx.throw(501))

teacherRouter.get('/:teacherID', authFilter.teacherOrAdministrator, getHandler.single)
teacherRouter.all('/:teacherID', authFilter.administratorOnly)
teacherRouter.put('/:teacherID', (ctx) => ctx.throw(501))
teacherRouter.patch('/:teacherID', (ctx) => ctx.throw(501))
teacherRouter.delete('/:teacherID', deleteHandler.single)

teacherRouter.get('/:teacherID/courses', authFilter.teacherOrAdministrator, getHandler.courses)
teacherRouter.all('/:teacherID/courses', authFilter.administratorOnly)
teacherRouter.put('/:teacherID/courses', (ctx) => ctx.throw(501))
teacherRouter.patch('/:teacherID/courses', (ctx) => ctx.throw(501))

export default teacherRouter
