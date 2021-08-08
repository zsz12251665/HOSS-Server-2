import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { Student } from './Student'
import { Task } from './Task'
import { Teacher } from './Teacher'

@Entity()
export class Course {
	@PrimaryKey()
	id!: number

	@Property()
	name!: string

	@ManyToMany()
	students = new Collection<Student>(this)

	@ManyToMany()
	teachers = new Collection<Teacher>(this)

	@OneToMany(() => Task, 'course')
	tasks = new Collection<Task>(this)
}
