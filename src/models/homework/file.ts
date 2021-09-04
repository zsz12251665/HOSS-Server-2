import ORM, { Homework } from '@/ORM'
import OSS from '@/OSS'
import Joi from 'joi'
import { RouterContext } from '@koa/router'

const schema = Joi.object({
	filename: Joi.string().required()
})

/** 作业文件上传请求 */
export async function upload(ctx: RouterContext) {
	const { filename }: { filename: string } = await schema.validateAsync(ctx.request.body)
	const { courseID, taskID, studentID } = ctx.params
	const repo = ORM.em.getRepository(Homework)
	let homework = await repo.findOne([[courseID, taskID], studentID])
	if (homework === null) {
		homework = repo.create({ task: [courseID, taskID], student: studentID, filename })
		repo.persist(homework)
	} else
		homework.filename = filename
	await repo.flush()
	ctx.body = await OSS.client.upload(`/courses/${courseID}/tasks/${taskID}/homeworks/${studentID}`)
}

/** 作业文件下载请求 */
export async function download(ctx: RouterContext) {
	const { courseID, taskID, studentID } = ctx.params
	const repo = ORM.em.getRepository(Homework)
	const homework = await repo.findOne([[courseID, taskID], studentID])
	if (homework === null || homework.filename === null)
		ctx.throw(404)
	ctx.body = await OSS.client.download(`/courses/${courseID}/tasks/${taskID}/homeworks/${studentID}`)
}

/** 作业文件删除请求 */
export async function remove(ctx: RouterContext) {
	const { courseID, taskID, studentID } = ctx.params
	const repo = ORM.em.getRepository(Homework)
	const homework = await repo.findOne([[courseID, taskID], studentID])
	if (homework === null || homework.filename === null)
		ctx.throw(404)
	homework.filename = null
	await Promise.all([
		repo.flush(),
		OSS.client.remove(`/courses/${courseID}/tasks/${taskID}/homeworks/${studentID}`)
	])
	ctx.body = null
}
