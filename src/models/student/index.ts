import Router from '@koa/router'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as getHandler from './get'
import * as patchHandler from './patch'
import * as putHandler from './put'

const studentRouter = new Router({ prefix: '/students' })

studentRouter.all('/', authFilter.administratorOnly)
studentRouter.get('/', getHandler.batch)
studentRouter.put('/', putHandler.batch)
studentRouter.patch('/', patchHandler.batch)

studentRouter.get('/:studentID', authFilter.selfOrAdministrator, getHandler.single)
studentRouter.all('/:studentID', authFilter.administratorOnly)
studentRouter.put('/:studentID', putHandler.single)
studentRouter.patch('/:studentID', patchHandler.single)
studentRouter.delete('/:studentID', deleteHandler.single)

studentRouter.get('/:studentID/courses', authFilter.selfOrAdministrator, getHandler.courses)
studentRouter.put('/:studentID/courses', authFilter.administratorOnly, putHandler.courses)
studentRouter.patch('/:studentID/courses', authFilter.administratorOnly, patchHandler.courses)

studentRouter.get('/:studentID/tasks', authFilter.selfOnly, getHandler.tasks)

export default studentRouter
