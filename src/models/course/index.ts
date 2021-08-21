import Router from '@koa/router'
import * as authFilter from './auth'

const courseRouter = new Router({ prefix: '/courses' })

courseRouter.get('/', authFilter.studentOrTeacherOrAdministrator)
courseRouter.all('/', authFilter.administratorOnly)
courseRouter.put('/')
courseRouter.patch('/')

courseRouter.get('/:courseID', authFilter.studentOrTeacherOrAdministrator)
courseRouter.all('/:courseID', authFilter.administratorOnly)
courseRouter.put('/:courseID')
courseRouter.patch('/:courseID')
courseRouter.delete('/:courseID')

courseRouter.get('/:courseID/students', authFilter.studentOrTeacherOrAdministrator)
courseRouter.all('/:courseID/students', authFilter.administratorOnly)
courseRouter.put('/:courseID/students')
courseRouter.patch('/:courseID/students')

courseRouter.get('/:courseID/students', authFilter.studentOrTeacherOnly)
courseRouter.all('/:courseID/students', authFilter.teacherOnly)
courseRouter.put('/:courseID/students')
courseRouter.patch('/:courseID/students')

courseRouter.get('/:courseID/teachers', authFilter.studentOrTeacherOrAdministrator)
courseRouter.all('/:courseID/teachers', authFilter.administratorOnly)
courseRouter.put('/:courseID/teachers')
courseRouter.patch('/:courseID/teachers')

courseRouter.use((ctx) => ctx.throw(501))

export default courseRouter
