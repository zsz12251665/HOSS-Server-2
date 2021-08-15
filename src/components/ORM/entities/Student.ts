import { Collection, Entity, ManyToMany, OneToMany, OneToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Course } from './Course'
import { Homework } from './Homework'
import { User } from './User'

@Entity()
export class Student {
	[PrimaryKeyType]: string

	@PrimaryKey()
	number!: string

	@Property()
	name!: string

	@Property()
	class?: string

	@OneToOne(() => User, 'student')
	user?: User

	@ManyToMany(() => Course, 'students')
	courses = new Collection<Course>(this)

	@OneToMany(() => Homework, 'student')
	homeworks = new Collection<Homework>(this)
}
