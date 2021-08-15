import { Collection, Entity, ManyToMany, OneToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { Student } from './Student'
import { Task } from './Task'
import { Teacher } from './Teacher'

@Entity()
export class User {
	[PrimaryKeyType]: string

	@PrimaryKey({ serializedName: 'username' })
	identification!: string

	@Property({ hidden: true })
	certificate!: string

	@Property()
	isAdministrator: boolean = false

	@OneToOne({ serializedName: 'studentNumber' })
	student?: Student

	@OneToOne({ serializedName: 'teacherID' })
	teacher?: Teacher

	@ManyToMany({ hidden: true })
	tasks = new Collection<Task>(this)
}
