import Router from '@koa/router'
import loginMiddleware from '@models/users/login'
import registerMiddleware from '@models/users/register'

const router = new Router()

router.post('/login', loginMiddleware)
router.post('/register', registerMiddleware)
router.post('/users', registerMiddleware)
router.post('/users/:username/token', loginMiddleware)

export default router
