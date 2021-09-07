import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Student, Task, Teacher, User } from '.'

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

	@ManyToMany({ hidden: true })
	assistants = new Collection<User>(this)

	@OneToMany(() => Task, 'course', { hidden: true, orphanRemoval: true })
	tasks = new Collection<Task>(this)
}
