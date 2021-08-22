import Router from '@koa/router'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as getHandler from './get'

const courseRouter = new Router({ prefix: '/courses' })

courseRouter.get('/', authFilter.studentOrTeacherOrAdministrator, getHandler.batch)
courseRouter.all('/', authFilter.administratorOnly)
courseRouter.put('/')
courseRouter.patch('/')

courseRouter.get('/:courseID', authFilter.studentOrTeacherOrAdministrator, getHandler.single)
courseRouter.all('/:courseID', authFilter.administratorOnly)
courseRouter.put('/:courseID')
courseRouter.patch('/:courseID')
courseRouter.delete('/:courseID', deleteHandler.single)

courseRouter.get('/:courseID/students', authFilter.studentOrTeacherOrAdministrator, getHandler.students)
courseRouter.all('/:courseID/students', authFilter.administratorOnly)
courseRouter.put('/:courseID/students')
courseRouter.patch('/:courseID/students')

courseRouter.get('/:courseID/tasks', authFilter.studentOrTeacherOnly, getHandler.tasks)
courseRouter.all('/:courseID/tasks', authFilter.teacherOnly)
courseRouter.put('/:courseID/tasks')
courseRouter.patch('/:courseID/tasks')

courseRouter.get('/:courseID/teachers', authFilter.studentOrTeacherOrAdministrator, getHandler.teachers)
courseRouter.all('/:courseID/teachers', authFilter.administratorOnly)
courseRouter.put('/:courseID/teachers')
courseRouter.patch('/:courseID/teachers')

courseRouter.use((ctx) => ctx.throw(501))

export default courseRouter
