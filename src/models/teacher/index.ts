import Router from '@koa/router'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as getHandler from './get'
import * as patchHandler from './patch'
import * as putHandler from './put'

const teacherRouter = new Router({ prefix: '/teachers' })

teacherRouter.all('/', authFilter.administratorOnly)
teacherRouter.get('/', getHandler.batch)
teacherRouter.put('/', putHandler.batch)
teacherRouter.patch('/', patchHandler.batch)

teacherRouter.get('/:teacherID', authFilter.selfOrAdministrator, getHandler.single)
teacherRouter.all('/:teacherID', authFilter.administratorOnly)
teacherRouter.put('/:teacherID', putHandler.single)
teacherRouter.patch('/:teacherID', patchHandler.single)
teacherRouter.delete('/:teacherID', deleteHandler.single)

teacherRouter.get('/:teacherID/courses', authFilter.selfOrAdministrator, getHandler.courses)
teacherRouter.put('/:teacherID/courses', authFilter.administratorOnly, putHandler.courses)
teacherRouter.patch('/:teacherID/courses', authFilter.administratorOnly, patchHandler.courses)

teacherRouter.get('/:teacherID/tasks', authFilter.selfOnly, getHandler.tasks)

export default teacherRouter
