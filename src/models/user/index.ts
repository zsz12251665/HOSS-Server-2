import Router from '@koa/router'
import * as authFilter from './auth'
import * as deleteHandler from './delete'
import * as getHandler from './get'
import * as patchHandler from './patch'
import * as postHandler from './post'
import * as putHandler from './put'

const userRouter = new Router({ prefix: '/users' })

userRouter.post('/', postHandler.register)
userRouter.post('/:userID/token', postHandler.login)

userRouter.all('/', authFilter.administratorOnly)
userRouter.get('/', getHandler.batch)
userRouter.put('/', putHandler.batch)
userRouter.patch('/', patchHandler.batch)

userRouter.all('/:userID', authFilter.selfOrAdministrator)
userRouter.get('/:userID', getHandler.single)
userRouter.put('/:userID', authFilter.administratorOnly, putHandler.single)
userRouter.patch('/:userID', patchHandler.single)
userRouter.delete('/:userID', deleteHandler.single)

userRouter.get('/:userID/tasks', authFilter.selfOnly, getHandler.tasks)

export default userRouter
