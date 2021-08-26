import { PathLike, createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs'
import path from 'path'
import BaseOSS from '../base'
import { Readable, Writable } from 'stream'
import { copyFile, readdir, unlink } from 'fs/promises'

class LocalOSS extends BaseOSS {
	private base!: string

	async list() {
		return readdir(this.base)
	}

	async upload(identifier: string, file: PathLike | Readable) {
		const location = path.resolve(this.base, identifier)
		if (file instanceof Readable)
			return new Promise<void>((resolve, reject) => {
				const stream = createWriteStream(location)
				file.pipe(stream)
				file.on('error', reject)
				file.on('end', resolve)
			})
		else
			return copyFile(file, location)
	}

	async download(identifier: string, file: PathLike | Writable): Promise<void>;
	async download(identifier: string): Promise<Readable>;
	async download(identifier: string, file?: PathLike | Writable) {
		const location = path.resolve(this.base, identifier)
		if (file === undefined)
				return createReadStream(location)
		else if (file instanceof Writable)
			return new Promise((resolve, reject) => {
				const stream = createReadStream(location)
				stream.pipe(file)
				stream.on('error', reject)
				stream.on('end', resolve)
			})
		else
			return copyFile(location, file)
	}

	async contains(identifier: string) {
		const location = path.resolve(this.base, identifier)
		return existsSync(location)
	}

	async remove(identifier: string) {
		const location = path.resolve(this.base, identifier)
		return unlink(location)
	}

	constructor(config: any) {
		super()
		this.base = config.base
	}
}

export default LocalOSS
