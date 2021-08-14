import { Collection, Entity, ManyToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Student } from './Student'
import { Task } from './Task'
import { Teacher } from './Teacher'

@Entity()
export class User {
	@PrimaryKey()
	identification!: string

	@Property()
	certificate!: string

	@Property()
	isAdministrator: boolean = false

	@OneToOne()
	student?: Student

	@OneToOne()
	teacher?: Teacher

	@ManyToMany()
	tasks = new Collection<Task>(this)
}
