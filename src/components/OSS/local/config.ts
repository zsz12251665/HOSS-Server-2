import { existsSync } from 'fs'
import { prompt as ask } from 'inquirer'

const configure = async (defaultConfig: { [key: string]: any }) => ask([{
	name: 'base',
	type: 'string',
	message: 'Base Directory',
	validate: (input) => existsSync(input) ? true : 'The folder does not exists!',
	default: (defaultConfig.dialect === 'local') ? defaultConfig.base || undefined : undefined
}])

export default configure
