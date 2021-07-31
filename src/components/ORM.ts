import { Sequelize, DataTypes, Options } from 'sequelize'
import config from '@config/db.json'
import hash from '@/hash'

const sequelize = new Sequelize(<Options>config)

// 模型实体定义

export const User = sequelize.define('User', {
	identification: {
		type: DataTypes.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	certificate: {
		type: DataTypes.STRING,
		allowNull: false,
		set(value: string): void { this.setDataValue('certificate', hash(value)) }
	},
	isAdministrator: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})

export const Student = sequelize.define('Student', {
	number: {
		type: DataTypes.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	class: {
		type: DataTypes.STRING
	}
})

export const Teacher = sequelize.define('Teacher', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	}
})

export const Course = sequelize.define('Course', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	}
})

export const Task = sequelize.define('Task', {
	title: {
		type: DataTypes.STRING,
		allowNull: false
	},
	deadline: {
		type: DataTypes.DATE
	},
	description: {
		type: DataTypes.TEXT
	},
	pattern: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: ':name:-:number:'
	}
})

export const Homework = sequelize.define('Homework', {
	file: {
		type: DataTypes.BLOB
	},
	filename: {
		type: DataTypes.STRING
	},
	submissionTime: {
		type: DataTypes.DATE
	},
	group: {
		type: DataTypes.STRING
	}
})

// 模型关系定义

User.hasOne(Student)
Student.belongsTo(User)

User.hasOne(Teacher)
Teacher.belongsTo(User)

Student.belongsToMany(Course, { through: 'Take' })
Course.belongsToMany(Student, { through: 'Take' })

Teacher.belongsToMany(Course, { through: 'Teach' })
Course.belongsToMany(Teacher, { through: 'Teach' })

Student.belongsToMany(Task, { as: 'Monitor', through: 'Manage' })
Task.belongsToMany(Student, { as: 'Supervisee', through: 'Manage' })

Course.hasMany(Task) // Assign
Task.belongsTo(Course)

Student.hasMany(Homework) // Write
Homework.belongsTo(Student)

Task.hasMany(Homework) // Complete
Homework.belongsTo(Task)
