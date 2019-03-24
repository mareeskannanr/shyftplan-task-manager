const fs = require('fs');
const bcrypt = require('bcrypt');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

module.exports = {
    async validateUserInfo(user) {
        try {
            let errors = [], required = [], invalid = [];
            if(!user.email || !user.email.trim()) {
                required.push('Email');
            }

            if(user.email && user.email.trim() && !/\S+@\S+\.\S+/.test(user.email)) {
                invalid.push('Email');
            }

            if(!user.userName || !user.userName.trim()) {
                required.push('User Name');
            }

            if(!user.password || !user.password.trim()) {
                required.push('Password');
            }

            if(!user.confirmPassword || !user.confirmPassword.trim()) {
                required.push('Confirm Password');
            }

            if(user.password && user.password.trim() && user.confirmPassword && user.confirmPassword.trim() && (user.password != user.confirmPassword)) {
                errors.push('Password, Confirm Password are not same.');
            }

            if(user.email && user.email.trim() && /\S+@\S+\.\S+/.test(user.email)) {
                let queryString = "SELECT COUNT(id) FROM users WHERE email=$1;";
                let result = await dbConnection.query(queryString, [user.email]);

                if(result.rows[0].count > 0) {
                    errors.push(`User with Email ${user.email} Already Exists.`);
                }
            }

            if(invalid.length > 0) {
                errors.push(`${invalid.join(', ')}  ${invalid.length > 1 ? 'are' : 'is'} invalid.`);
            }

            if(required.length > 0) {
                errors.push(`${required.join(', ')}  ${required.length > 1 ? 'are' : 'is'} required.`);
            }
            
            return errors.reverse();
        } catch(e) {
            console.error(e);
            throw new Error(e);
        }
    },

    async createTasksTable(userId) {
        try {
            let tasksTable = modelTemplate.tasks.replace('${tasks}', `user_${userId}`);
            let result = await dbConnection.query(tasksTable);

            return result.rows;
        } catch(e) {
            console.error(e);
            throw new Error(`Exception While Creating Tasks Table user_${userId}`);
        }
    },

    async readSchemas() {
        try {
            let users = await readFile('./models/users.sql');
            let tasks = await readFile('./models/tasks.sql');

            users = users.toString();
            tasks = tasks.toString();

            global.modelTemplate = { users, tasks };
        } catch(e) {
            console.log(e);
            throw new Error('Schema File Read Error');
        }
    },

    async validateTask(task) {
        let errors = [];

        if(!task.description || !task.description.trim()) {
            errors.push('Description is required.');
        }

        if(!task.assignedTo) {
            errors.push('Assigned To is required.');
        }

        if(task.assignedTo && (isNaN(task.assignedTo) || task.assignedTo <= 0)) {
            errors.push('Assigned To is invalid.');
        }

        if(task.assignedTo && !isNaN(task.assignedTo) && task.assignedTo > 0) {
            let queryString = "SELECT id FROM users WHERE id=$1;";
            let result = await dbConnection.query(queryString, [task.assignedTo]);

            if(result.rows.length == 0) {
                errors.push(`Assigned To User Doesn't exists in DB.`);
            }
        }

        if(!task.startTime || !task.startTime.toString().trim()) {
            errors.push('Start Time is required.');
        }

        if(!task.endTime || !task.endTime.toString().trim()) {
            errors.push('End Time is required.');
        }

        if(task.startTime && task.startTime.toString().trim() && 
                task.endTime && task.endTime.toString().trim() && 
                (new Date(task.endTime) < new Date(task.startTime))) {
            errors.push('End Time must be greater than Start Time.');
        }

        return errors;
    },

    validateCredentials(login) {
        let errors = [];
        if(!login.email || !login.email.trim()) {
            errors.push('Email Id is required.');
        }

        if(login.email && login.email.trim() && !/\S+@\S+\.\S+/.test(login.email)) {
            invalid.push('Email Id is invalid.');
        }

        if(!login.password || !login.password.trim()) {
            errors.push('Password is required.');
        }

        return errors;
    },

    async authenticateUser(login) {
        try {
            let queryString = 'SELECT * FROM users WHERE email=$1;'
            let result = await dbConnection.query(queryString, [login.email]);
            if(result.rows.length == 0) {
                throw new Error('user_not_found');
            }

            let isValidPassword = await bcrypt.compare(login.password, result.rows[0].password);
            if(isValidPassword) {
                delete result.rows[0].password;
                return result.rows[0];
            }
            
            throw new Error('incorrect');
        } catch(e) {
            throw e;
        }
    },

    handleAuthenicateException(error, req, res) {
        let exceptionMap = {
            'user_not_found': `User Doesn't Exists!`,
            'incorrect': 'Email or Password Incorrect!'
        };

        let message = exceptionMap[error.message];
        if(process.env.MODE === 'test') {
            if(message) {
                return res.status(401).json({messge});
            }

            return res.status(500).json({messge: 'Sorry, something went wrong!'});
        }

        req.session.errors = message || 'Sorry, something went wrong!';
        return res.redirect('/login');
    },
    
};