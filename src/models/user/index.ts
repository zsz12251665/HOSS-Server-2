import Router from '@koa/router'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as getHandler from './get'
import * as patchHandler from './patch'
import * as postHandler from './post'
import * as putHandler from './put'

const userRouter = new Router({ prefix: '/users' })

userRouter.post('/', postHandler.register)
userRouter.post('/:username/token', postHandler.login)

userRouter.all('/', authFilter.administratorOnly)
userRouter.get('/', getHandler.batch)
userRouter.put('/', putHandler.batch)
userRouter.patch('/', patchHandler.batch)
userRouter.delete('/', deleteHandler.batch)

userRouter.all('/:username', authFilter.selfOrAdministrator)
userRouter.get('/:username', getHandler.single)
userRouter.put('/:username', authFilter.administratorOnly, putHandler.single)
userRouter.patch('/:username', patchHandler.single)
userRouter.delete('/:username', deleteHandler.single)

userRouter.get('/:username/tasks', authFilter.selfOnly, getHandler.tasks)

export default userRouter
