/**
 * 基于 Sequelize 的 ORM 定义与数据管理模块
 * @module db
 */

const config = require('@config/db.json');
const { Sequelize, DataTypes } = require('sequelize');
const { createHash } = require('crypto');

const sequelize = new Sequelize(config);

// 模型实体定义

const User = sequelize.define('User', {
	identification: {
		type: DataTypes.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	certificate: {
		type: DataTypes.STRING,
		allowNull: false,
		set(value) { // 使用 SHA256 对密码域进行加密
			const generator = createHash('sha256');
			generator.update(value);
			this.setDataValue('certificate', generator.digest('hex'));
		}
	},
	isAdministrator: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

const Student = sequelize.define('Student', {
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
});

const Teacher = sequelize.define('Teacher', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	}
});

const Course = sequelize.define('Course', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	}
});

const Task = sequelize.define('Task', {
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
});

const Homework = sequelize.define('Homework', {
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
});

// 模型关系定义

User.hasOne(Student);
Student.belongsTo(User);

User.hasOne(Teacher);
Teacher.belongsTo(User);

Student.belongsToMany(Course, { through: 'Take' });
Course.belongsToMany(Student, { through: 'Take' });

Teacher.belongsToMany(Course, { through: 'Teach' });
Course.belongsToMany(Teacher, { through: 'Teach' });

Student.belongsToMany(Task, { as: 'Monitor', through: 'Manage' });
Task.belongsToMany(Student, { as: 'Supervisee', through: 'Manage' });

Course.hasMany(Task); // Assign
Task.belongsTo(Course);

Student.hasMany(Homework); // Write
Homework.belongsTo(Student);

Task.hasMany(Homework); // Complete
Homework.belongsTo(Task);

/** 检测数据库连接 */
function test() {
	return sequelize.authenticate();
}

/** 清空并重新初始化数据库 */
function clear() {
	return sequelize.sync({ force: true });
}

module.exports = { User, Student, Teacher, Course, Task, Homework, test, clear };
