import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Course } from './Course'
import { Homework } from './Homework'
import { User } from './User'

@Entity()
export class Task {
	[PrimaryKeyType]: string

	@PrimaryKey()
	id!: string

	@Property()
	title!: string

	@Property()
	deadline?: Date

	@Property({ columnType: 'text' })
	description?: string

	@Property()
	pattern: string = ':name:-:id:'

	@ManyToOne()
	course!: Course

	@OneToMany(() => Homework, 'task', { hidden: true })
	homeworks = new Collection<Homework>(this)

	@ManyToMany(() => User, 'tasks', { hidden: true })
	monitors = new Collection<User>(this)
}
