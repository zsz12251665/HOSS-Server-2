import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Student } from './Student'
import { Task } from './Task'
import { Teacher } from './Teacher'

@Entity()
export class Course {
	[PrimaryKeyType]: Course['id']

	@PrimaryKey()
	id!: string

	@Property()
	name!: string

	@ManyToMany({ hidden: true })
	students = new Collection<Student>(this)

	@ManyToMany({ hidden: true })
	teachers = new Collection<Teacher>(this)

	@OneToMany(() => Task, 'course', { hidden: true, orphanRemoval: true })
	tasks = new Collection<Task>(this)
}
