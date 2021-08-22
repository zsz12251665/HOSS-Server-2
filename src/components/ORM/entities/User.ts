import { Collection, Entity, ManyToMany, OneToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { BinaryLike, createHash } from 'crypto'
import { Student } from './Student'
import { Task } from './Task'
import { Teacher } from './Teacher'

const encrypt = (content: BinaryLike) => createHash('sha256').update(content).digest('hex')

@Entity()
export class User {
	[PrimaryKeyType]: string

	@PrimaryKey()
	id!: string

	@Property({ hidden: true })
	authentication!: string

	@Property({ persist: false })
	set password(value: string) {
		this.authentication = encrypt(value)
	}

	authenticate(password: string): boolean {
		return this.authentication === encrypt(password)
	}

	@Property()
	isAdministrator: boolean = false

	@OneToOne()
	student: Student | null = null

	@OneToOne()
	teacher: Teacher | null = null

	@ManyToMany({ hidden: true })
	tasks = new Collection<Task>(this)
}
