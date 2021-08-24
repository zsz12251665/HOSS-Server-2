import { Context } from 'koa'

/** 作业文件上传请求 */
export async function upload(ctx: Context) {
	ctx.throw(501)
}

/** 作业文件下载请求 */
export async function download(ctx: Context) {
	ctx.throw(501)
}

/** 作业文件删除请求 */
export async function remove(ctx: Context) {
	ctx.throw(501)
}
