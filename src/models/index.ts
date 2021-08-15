import Router from '@koa/router'
import courseRouter from './course'
import studentRouter from './student'
import taskRouter from './task'
import teacherRouter from './teacher'
import userRouter from './user'
import { login, register } from './user/post'

const router = new Router()

router.use(userRouter.routes())
router.use(studentRouter.routes())
router.use(teacherRouter.routes())
router.use(courseRouter.routes())
router.use(taskRouter.routes())

// Shortcuts
router.post('/login', login)
router.post('/register', register)

export default router