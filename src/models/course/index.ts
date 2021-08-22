import Router from '@koa/router'
import taskRouter from '../task'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as getHandler from './get'
import * as patchHandler from './patch'
import * as putHandler from './put'

const courseRouter = new Router({ prefix: '/courses' })

courseRouter.get('/', authFilter.studentOrTeacherOrAdministrator, getHandler.batch)
courseRouter.put('/', authFilter.administratorOnly, putHandler.batch)
courseRouter.patch('/', authFilter.administratorOnly, patchHandler.batch)

courseRouter.get('/:courseID', authFilter.studentOrTeacherOrAdministrator, getHandler.single)
courseRouter.all('/:courseID', authFilter.administratorOnly)
courseRouter.put('/:courseID', putHandler.single)
courseRouter.patch('/:courseID', patchHandler.single)
courseRouter.delete('/:courseID', deleteHandler.single)

courseRouter.get('/:courseID/students', authFilter.studentOrTeacherOrAdministrator, getHandler.students)
courseRouter.put('/:courseID/students', authFilter.administratorOnly, putHandler.students)
courseRouter.patch('/:courseID/students', authFilter.administratorOnly, patchHandler.students)

courseRouter.use('/:courseID', taskRouter.routes()) // /:courseID/tasks

courseRouter.get('/:courseID/teachers', authFilter.studentOrTeacherOrAdministrator, getHandler.teachers)
courseRouter.put('/:courseID/teachers', authFilter.administratorOnly, putHandler.teachers)
courseRouter.patch('/:courseID/teachers', authFilter.administratorOnly, patchHandler.teachers)

courseRouter.use((ctx) => ctx.throw(501))

export default courseRouter
