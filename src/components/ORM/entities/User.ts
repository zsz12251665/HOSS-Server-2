import { Collection, Entity, ManyToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Student } from './Student'
import { Teacher } from './Teacher'
import { Task } from './Task'

@Entity()
export class User {
	@PrimaryKey()
	identification!: string

	@Property()
	certificate!: string

	@Property()
	isAdministrator: boolean = false

	@OneToOne(() => Student, 'user')
	student?: Student

	@OneToOne(() => Teacher, 'user')
	teacher?: Teacher

	@ManyToMany(() => Task, 'monitors')
	managedTasks = new Collection<Task>(this)
}
