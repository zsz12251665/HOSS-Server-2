import Router from '@koa/router'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as getHandler from './get'
import * as patchHandler from './patch'
import * as putHandler from './put'

const studentRouter = new Router({ prefix: '/students' })

studentRouter.get('/', authFilter.administratorOnly, getHandler.batch)
studentRouter.put('/', authFilter.administratorOnly, putHandler.batch)
studentRouter.patch('/', authFilter.administratorOnly, patchHandler.batch)

studentRouter.get('/:studentID', authFilter.selfOrAdministrator, getHandler.single)
studentRouter.put('/:studentID', authFilter.administratorOnly, putHandler.single)
studentRouter.patch('/:studentID', authFilter.administratorOnly, patchHandler.single)
studentRouter.delete('/:studentID', authFilter.administratorOnly, deleteHandler.single)

studentRouter.get('/:studentID/courses', authFilter.selfOrAdministrator, getHandler.courses)
studentRouter.put('/:studentID/courses', authFilter.administratorOnly, putHandler.courses)
studentRouter.patch('/:studentID/courses', authFilter.administratorOnly, patchHandler.courses)

studentRouter.get('/:studentID/tasks', authFilter.selfOnly, getHandler.tasks)

export default studentRouter
