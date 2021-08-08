import { Collection, Entity, ManyToMany, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Course } from './Course'
import { Homework } from './Homework'
import { User } from './User'

@Entity()
export class Student {
	@PrimaryKey()
	number!: string

	@Property()
	name!: string

	@Property()
	class?: string

	@OneToOne()
	user?: User

	@ManyToMany(() => Course, 'students')
	courses = new Collection<Course>(this)

	@OneToMany(() => Homework, 'student')
	homeworks = new Collection<Homework>(this)
}
