const bcrypt = require('bcrypt');

const utils = require('../utils');

module.exports = {

    async registerUserInfo(req, res) {
        try {
            let errors = await utils.validateUserInfo(req.body);
            if(errors.length > 0) {
                req.session.errors = errors;

                if(process.env.NODE_ENV === 'test') {
                    return res.status(400).json(errors);
                }

                return res.redirect('/signup');
            }

            let password = await bcrypt.hash(req.body.password, 10);
            let queryString = `INSERT INTO users(email, password, user_name) VALUES($1, $2, $3) RETURNING id;`;
            let result = await dbConnection.query(queryString, [req.body.email, password, req.body.userName]);

            await utils.createTasksTable(result.rows[0].id);

            if(process.env.NODE_ENV === 'test') {
                return res.status(201).json({message: 'User Created Successfully!'});
            }

            req.session.successMsg = 'User Created Successfully!';
            res.redirect('/login');
        } catch(err) {
            console.error(err);
            res.status(500).json({messge: 'Sorry, something went wrong!'});
        }
    },

    async getAllUsers(req, res) {
        try {
            let queryString = 'SELECT id,email FROM users;'
            let result = await dbConnection.query(queryString);
            res.status(200).json(result.rows);
        } catch(e) {
            console.error(e);
            res.status(500).json({messge: 'Sorry, something went wrong!'});
        }
    },

    async loginUser(req, res) {
        try {
            let errors = utils.validateCredentials(req.body);
            if(errors.length > 0) {
                return res.status(400).json(errors);
            }

            let result = await utils.authenticateUser(req.body);
            req.session.user = result;
            return res.redirect('/task-manager');

        } catch(e) {
            utils.handleAuthenicateException(e, req, res);
        }
    },

};