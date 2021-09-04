import ORM, { Task } from '@/ORM'
import OSS from '@/OSS'
import { Context } from 'koa'

/** 作业文件打包下载请求 */
export async function download(ctx: Context) {
	const { courseID, taskID }: { [key: string]: string } = ctx.params
	const repo = ORM.em.getRepository(Task)
	const task = await repo.findOne([courseID, taskID], ['homeworks'])
	if (task === null)
		ctx.throw(404)
	const entries = task.homeworks.getItems()
		.filter((homework) => homework.filename !== null)
		.map((homework) => [`/courses/${courseID}/tasks/${taskID}/homeworks/${homework.student.id}`, <string>homework.filename])
	ctx.body = await OSS.client.archive(Object.fromEntries(entries))
}
