import { Collection, Entity, ManyToMany, OneToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Course } from './Course'
import { User } from './User'

@Entity()
export class Teacher {
	[PrimaryKeyType]: number

	@PrimaryKey()
	id!: number

	@Property()
	name!: string

	@OneToOne(() => User, 'teacher')
	user?: User

	@ManyToMany(() => Course, 'teachers')
	courses = new Collection<Course>(this)
}
