import Router from '@koa/router'
import tokenMiddleware from '../token'
import { administratorOnlyFilter, selfAndAdministratorFilter } from './auth'
import { deleteMultiple, deleteSingle } from './delete'
import { getMultiple, getSingle } from './get'
import { patchMultiple, patchSingle } from './patch'
import { login, register } from './post'

const userRouter = new Router({ prefix: '/users' })

userRouter.post('/', register)
userRouter.post('/:username/token', login)

userRouter.use(tokenMiddleware)

userRouter.use(selfAndAdministratorFilter)

userRouter.get('/:username', getSingle)
userRouter.patch('/:username', patchSingle)
userRouter.delete('/:username', deleteSingle)

userRouter.use(administratorOnlyFilter)

userRouter.get('/', getMultiple)
userRouter.patch('/', patchMultiple)
userRouter.delete('/', deleteMultiple)

export default userRouter
