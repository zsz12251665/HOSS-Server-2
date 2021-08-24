import { Collection, Entity, ManyToMany, OneToMany, OneToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Course } from './Course'
import { Homework } from './Homework'
import { User } from './User'

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

	@OneToMany(() => Homework, 'student', { hidden: true, orphanRemoval: true })
	homeworks = new Collection<Homework>(this)
}
