import config from '@config/orm.json'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import entityConfiguration from './entities'

class ORM {
	private static instance?: MikroORM

	static async init(): Promise<void> {
		ORM.instance = await MikroORM.init(<any>Object.assign({}, entityConfiguration, config))
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
