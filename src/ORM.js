const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize();

const User = sequelize.define('User', {
	identification: {
		type: DataTypes.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	certificate: {
		type: DataTypes.STRING,
		allowNull: false
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
