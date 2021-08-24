import Router from '@koa/router'
import homeworkRouter from '../homework'
import paramValidator from './param'

const taskRouter = new Router({ prefix: '/tasks' })

taskRouter.use(paramValidator)

taskRouter.get('/')
taskRouter.put('/')
taskRouter.patch('/')

taskRouter.get('/:taskID')
taskRouter.put('/:taskID')
taskRouter.patch('/:taskID')
taskRouter.delete('/:taskID')

taskRouter.get('/:taskID/files')

taskRouter.use('/:taskID', homeworkRouter.routes()) // /:taskID/homeworks

taskRouter.get('/:taskID/monitors')
taskRouter.put('/:taskID/monitors')
taskRouter.patch('/:taskID/monitors')

taskRouter.use((ctx) => ctx.throw(501))

export default taskRouter
