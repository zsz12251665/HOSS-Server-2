import { Collection, Entity, ManyToMany, OneToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Course } from './Course'
import { User } from './User'

@Entity()
export class Teacher {
	[PrimaryKeyType]: string

	@PrimaryKey()
	id!: string

	@Property()
	name!: string

	@OneToOne(() => User, 'teacher')
	user: User | null = null

	@ManyToMany(() => Course, 'teachers', { hidden: true })
	courses = new Collection<Course>(this)
}
