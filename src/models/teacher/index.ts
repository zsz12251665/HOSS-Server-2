import Router from '@koa/router'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as getHandler from './get'
import * as patchHandler from './patch'
import * as putHandler from './put'

const teacherRouter = new Router({ prefix: '/teachers' })

teacherRouter.get('/', authFilter.administratorOnly, getHandler.batch)
teacherRouter.put('/', authFilter.administratorOnly, putHandler.batch)
teacherRouter.patch('/', authFilter.administratorOnly, patchHandler.batch)

teacherRouter.get('/:teacherID', authFilter.selfOrAdministrator, getHandler.single)
teacherRouter.put('/:teacherID', authFilter.administratorOnly, putHandler.single)
teacherRouter.patch('/:teacherID', authFilter.administratorOnly, patchHandler.single)
teacherRouter.delete('/:teacherID', authFilter.administratorOnly, deleteHandler.single)

teacherRouter.get('/:teacherID/courses', authFilter.selfOrAdministrator, getHandler.courses)
teacherRouter.put('/:teacherID/courses', authFilter.administratorOnly, putHandler.courses)
teacherRouter.patch('/:teacherID/courses', authFilter.administratorOnly, patchHandler.courses)

teacherRouter.get('/:teacherID/tasks', authFilter.selfOnly, getHandler.tasks)

export default teacherRouter
