import { Entity, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Student } from './Student'
import { Task } from './Task'

@Entity()
export class Homework {
	[PrimaryKeyType]: [string, number]

	@Property()
	filename?: string

	@Property()
	group?: string

	@ManyToOne({ primary: true })
	student!: Student

	@ManyToOne({ primary: true })
	task!: Task
}
