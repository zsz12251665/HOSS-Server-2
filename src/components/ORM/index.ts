import { ConnectionOptions, EntityManager, MikroORM } from '@mikro-orm/core'
import entities from './entities'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'

async function init(config?: ConnectionOptions): Promise<MikroORM> {
	if (config === undefined)
		config = await import('@config/db.json')
	return MikroORM.init(Object.assign({ entities, metadataProvider: TsMorphMetadataProvider }, config))
}

export * from './entities'

export default init
