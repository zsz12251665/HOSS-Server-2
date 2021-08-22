import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Student } from './Student'
import { Task } from './Task'

@Entity()
export class Homework {
	[PrimaryKeyType]: [string, string]

	@ManyToOne({ primary: true })
	task!: Task

	@ManyToOne({ primary: true })
	student!: Student

	@Property()
	filename: string | null = null

	@Property()
	group: string | null = null
}
