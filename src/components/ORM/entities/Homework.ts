import { Collection, Entity, ManyToMany, ManyToOne, Primary, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Student, Task } from '.'

@Entity()
export class Homework {
	[PrimaryKeyType]: [...Primary<Task>, Homework['id']]

	@ManyToOne({ primary: true })
	task!: Task

	@PrimaryKey()
	id!: number

	@Property()
	filename: string | null = null

	@ManyToMany({ hidden: true })
	students = new Collection<Student>(this)
}
