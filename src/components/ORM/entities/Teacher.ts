import { Collection, Entity, ManyToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Course } from './Course'
import { User } from './User'

@Entity()
export class Teacher {
	@PrimaryKey()
	id!: number

	@Property()
	name!: string

	@OneToOne()
	user?: User

	@ManyToMany(() => Course, 'teachers')
	courses = new Collection<Course>(this)
}
