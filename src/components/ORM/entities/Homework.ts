import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Student } from './Student'
import { Task } from './Task'

@Entity()
export class Homework {
	[PrimaryKeyType]: [string, string]

	@Property()
	filename?: string

	@Property()
	group?: string

	@ManyToOne({ primary: true })
	student!: Student

	@ManyToOne({ primary: true })
	task!: Task
}
