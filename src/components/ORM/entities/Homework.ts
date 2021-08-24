import { Entity, IdentifiedReference, ManyToOne, Primary, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Student } from './Student'
import { Task } from './Task'

@Entity()
export class Homework {
	[PrimaryKeyType]: [Primary<Task>, Primary<Student>]

	@ManyToOne({ primary: true })
	task!: IdentifiedReference<Task>

	@ManyToOne({ primary: true })
	student!: IdentifiedReference<Student>

	@Property()
	filename: string | null = null

	@Property()
	group: string | null = null
}
