import { ConnectionOptions, MikroORM } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import entities from './entities'

/**
 * ORM 初始化函数
 * @param {ConnectionOptions | undefined} config 数据库配置
 * @returns {Promise<MikroORM>} 异步返回一个 ORM 实例
 */
async function init(config?: ConnectionOptions): Promise<MikroORM> {
	if (config === undefined)
		config = await import('@config/db.json')
	return MikroORM.init(Object.assign({ entities, metadataProvider: TsMorphMetadataProvider }, config))
}

export * from './entities'

export default init
