import Router from '@koa/router'
import courseRouter from './course'
import { joiValidationErrorHandler } from './error'
import studentRouter from './student'
import teacherRouter from './teacher'
import tokenMiddleware from './token'
import userRouter from './user'
import { login, register } from './user/post'

const router = new Router()

router.use(tokenMiddleware)
router.use(joiValidationErrorHandler)

router.use(userRouter.routes())
router.use(studentRouter.routes())
router.use(teacherRouter.routes())
router.use(courseRouter.routes())

// Shortcuts
router.post('/login', login)
router.post('/register', register)

export default router
