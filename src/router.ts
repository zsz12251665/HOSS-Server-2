import Router from '@koa/router'
import tokenMiddleware from '@models/token'
import { getUserMultipleMiddleware, getUserSingleMiddleware } from '@models/users/get'
import { loginMiddleware, registerMiddleware } from '@models/users/post'

const router = new Router()

router.post('/login', loginMiddleware)
router.post('/register', registerMiddleware)
router.post('/users', registerMiddleware)
router.post('/users/:username/token', loginMiddleware)

router.use(tokenMiddleware)

router.get('/users', getUserMultipleMiddleware)
router.get('/users/:username', getUserSingleMiddleware)

export default router
