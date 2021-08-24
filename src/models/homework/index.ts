import Router from '@koa/router'
import * as authFilter from './auth'
import * as fileHandler from './file'
import * as getHandler from './get'
import paramValidator from './param'
import * as patchHandler from './patch'

const homeworkRouter = new Router({ prefix: '/homeworks' })

homeworkRouter.use(paramValidator)

homeworkRouter.get('/', authFilter.allRelatedOnes, getHandler.batch)
homeworkRouter.patch('/', authFilter.monitorOrTeacher, patchHandler.batch)

homeworkRouter.get('/:studentID', authFilter.studentOrMonitorOrTeacher, getHandler.single)
homeworkRouter.patch('/:studentID', authFilter.monitorOrTeacher, patchHandler.single)

homeworkRouter.get('/:studentID/file', authFilter.teacherOrStudent, fileHandler.download)
homeworkRouter.put('/:studentID/file', authFilter.studentOnly, fileHandler.upload)
homeworkRouter.delete('/:studentID/file', authFilter.teacherOnly, fileHandler.remove)

export default homeworkRouter
