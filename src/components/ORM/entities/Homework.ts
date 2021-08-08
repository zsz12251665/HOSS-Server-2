import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Student } from './Student'
import { Task } from './Task'

@Entity()
export class Homework {
	@Property()
	filename?: string

	@Property()
	group?: string

	@ManyToOne({ primary: true })
	student!: Student

	@ManyToOne({ primary: true })
	task!: Task
}
