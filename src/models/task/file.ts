import { Context } from 'koa'

/** 作业文件打包下载请求 */
export async function download(ctx: Context) {
	ctx.throw(501)
}
