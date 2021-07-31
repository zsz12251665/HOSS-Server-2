import { Router } from 'express'
import loginMiddleware from '@models/users/login'
import registerMiddleware from '@models/users/register'

const router = Router()

// 在此处转发 /api 的请求
router.post('/login', loginMiddleware)
router.post('/register', registerMiddleware)
router.post('/users', registerMiddleware)
router.post('/users/:username/token', loginMiddleware)

export default router
