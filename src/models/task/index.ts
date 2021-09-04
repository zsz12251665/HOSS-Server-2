import Router from '@koa/router'
import homeworkRouter from '../homework'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as fileHandler from './file'
import * as getHandler from './get'
import paramValidator from './param'
import * as patchHandler from './patch'
import * as putHandler from './put'

const taskRouter = new Router({ prefix: '/tasks' })

taskRouter.use(paramValidator)

taskRouter.get('/', authFilter.allRelatedOnes, getHandler.batch)
taskRouter.put('/', authFilter.teacherOnly, putHandler.batch)
taskRouter.patch('/', authFilter.teacherOnly, patchHandler.batch)

taskRouter.get('/:taskID', authFilter.monitorOrStudentOrTeacher, getHandler.single)
taskRouter.put('/:taskID', authFilter.teacherOnly, putHandler.single)
taskRouter.patch('/:taskID', authFilter.teacherOnly, patchHandler.single)
taskRouter.delete('/:taskID', authFilter.teacherOnly, deleteHandler.single)

taskRouter.get('/:taskID/files', authFilter.teacherOnly, fileHandler.download)

taskRouter.use('/:taskID', homeworkRouter.routes()) // /:taskID/homeworks

taskRouter.get('/:taskID/monitors', authFilter.monitorOrStudentOrTeacher, getHandler.monitors)
taskRouter.put('/:taskID/monitors', authFilter.teacherOnly, putHandler.monitors)
taskRouter.patch('/:taskID/monitors', authFilter.teacherOnly, patchHandler.monitors)

export default taskRouter
