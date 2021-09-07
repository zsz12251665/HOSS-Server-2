import { Collection, Entity, ManyToOne, OneToMany, Primary, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Course, Homework } from '.'

@Entity()
export class Task {
	[PrimaryKeyType]: [Primary<Course>, Task['id']]

	@ManyToOne({ primary: true })
	course!: Course

	@PrimaryKey()
	id!: number

	@Property()
	title!: string

	@Property()
	deadline: Date | null = null

	@Property({ columnType: 'text' })
	description: string = ''

	@OneToMany(() => Homework, 'task', { hidden: true, orphanRemoval: true })
	homeworks = new Collection<Homework>(this)
}
