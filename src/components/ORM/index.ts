import { ConnectionOptions, EntityManager, MikroORM } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import entities from './entities'

class ORM {
	static instance?: MikroORM

	/**
	 * ORM 初始化函数
	 * @param {ConnectionOptions | undefined} config 数据库配置
	 */
	static async init(config?: ConnectionOptions) {
		ORM.instance = await MikroORM.init(Object.assign({ entities, metadataProvider: TsMorphMetadataProvider }, config ?? await import('@config/orm.json')))
	}

	static get orm(): MikroORM {
		if (ORM.instance === undefined)
			throw new Error('ORM is not initialized!')
		return ORM.instance
	}

	static get em(): EntityManager {
		return ORM.orm.em
	}
}

export * from './entities'

export default ORM
