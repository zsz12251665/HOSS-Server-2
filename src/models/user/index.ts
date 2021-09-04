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

userRouter.get('/', authFilter.administratorOnly, getHandler.batch)
userRouter.put('/', authFilter.administratorOnly, putHandler.batch)
userRouter.patch('/', authFilter.administratorOnly, patchHandler.batch)

userRouter.get('/:userID', authFilter.selfOrAdministrator, getHandler.single)
userRouter.put('/:userID', authFilter.administratorOnly, putHandler.single)
userRouter.patch('/:userID', authFilter.selfOrAdministrator, patchHandler.single)
userRouter.delete('/:userID', authFilter.selfOrAdministrator, deleteHandler.single)

userRouter.get('/:userID/tasks', authFilter.selfOnly, getHandler.tasks)

export default userRouter
