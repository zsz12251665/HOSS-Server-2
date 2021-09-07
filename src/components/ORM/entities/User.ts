import { Collection, Entity, ManyToMany, OneToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { BinaryLike, createHash } from 'crypto'
import { Course, Student, Teacher } from '.'

const encrypt = (content: BinaryLike) => createHash('sha256').update(content).digest('hex')

@Entity()
export class User {
	[PrimaryKeyType]: User['id']

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

	@OneToOne({ onDelete: 'set null' })
	student: Student | null = null

	@OneToOne({ onDelete: 'set null' })
	teacher: Teacher | null = null

	@ManyToMany(() => Course, 'assistants', { hidden: true })
	courses = new Collection<Course>(this)
}
