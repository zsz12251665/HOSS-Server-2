import { Collection, Entity, IdentifiedReference, ManyToMany, ManyToOne, OneToMany, Primary, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Course } from './Course'
import { Homework } from './Homework'
import { User } from './User'

@Entity()
export class Task {
	[PrimaryKeyType]: [Primary<Course>, Task['id']]

	@ManyToOne({ primary: true })
	course!: IdentifiedReference<Course>

	@PrimaryKey()
	id!: string

	@Property()
	title!: string

	@Property()
	deadline: Date | null = null

	@Property({ columnType: 'text' })
	description: string = ''

	@Property()
	pattern: string = ':name:-:id:'

	@OneToMany(() => Homework, 'task', { hidden: true, orphanRemoval: true })
	homeworks = new Collection<Homework>(this)

	@ManyToMany(() => User, 'tasks', { hidden: true })
	monitors = new Collection<User>(this)
}
