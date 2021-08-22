import Router from '@koa/router'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as getHandler from './get'

const courseRouter = new Router({ prefix: '/courses' })

courseRouter.get('/', authFilter.studentOrTeacherOrAdministrator, getHandler.batch)
courseRouter.put('/', authFilter.administratorOnly)
courseRouter.patch('/', authFilter.administratorOnly)

courseRouter.get('/:courseID', authFilter.studentOrTeacherOrAdministrator, getHandler.single)
courseRouter.all('/:courseID', authFilter.administratorOnly)
courseRouter.put('/:courseID')
courseRouter.patch('/:courseID')
courseRouter.delete('/:courseID', deleteHandler.single)

courseRouter.get('/:courseID/students', authFilter.studentOrTeacherOrAdministrator, getHandler.students)
courseRouter.put('/:courseID/students', authFilter.administratorOnly)
courseRouter.patch('/:courseID/students', authFilter.administratorOnly)

courseRouter.get('/:courseID/tasks', authFilter.studentOrTeacherOnly, getHandler.tasks)

courseRouter.get('/:courseID/teachers', authFilter.studentOrTeacherOrAdministrator, getHandler.teachers)
courseRouter.put('/:courseID/teachers', authFilter.administratorOnly)
courseRouter.patch('/:courseID/teachers', authFilter.administratorOnly)

courseRouter.use((ctx) => ctx.throw(501))

export default courseRouter
