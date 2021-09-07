import { Collection, Entity, ManyToMany, OneToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Course, User } from '.'

@Entity()
export class Teacher {
	[PrimaryKeyType]: Teacher['id']

	@PrimaryKey()
	id!: string

	@Property()
	name!: string

	@OneToOne(() => User, 'teacher', { onDelete: 'set null' })
	user: User | null = null

	@ManyToMany(() => Course, 'teachers', { hidden: true })
	courses = new Collection<Course>(this)
}
