import { Collection, Entity, ManyToMany, OneToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Course, Homework, User } from '.'

@Entity()
export class Student {
	[PrimaryKeyType]: Student['id']

	@PrimaryKey()
	id!: string

	@Property()
	name!: string

	@Property()
	class: string | null = null

	@OneToOne(() => User, 'student', { onDelete: 'set null' })
	user: User | null = null

	@ManyToMany(() => Course, 'students', { hidden: true })
	courses = new Collection<Course>(this)

	@ManyToMany(() => Homework, 'students', { hidden: true })
	homeworks = new Collection<Homework>(this)
}
