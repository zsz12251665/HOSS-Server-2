import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { Course } from './Course'
import { Homework } from './Homework'
import { User } from './User'

@Entity()
export class Task {
	@PrimaryKey()
	id!: number

	@Property()
	title!: string

	@Property()
	deadline?: Date

	@Property({ columnType: 'text' })
	description?: string

	@Property()
	pattern: string = ':name:-:number'

	@ManyToOne()
	course!: Course

	@OneToMany(() => Homework, 'task')
	homeworks = new Collection<Homework>(this)

	@ManyToMany(() => User, 'tasks')
	monitors = new Collection<User>(this)
}
