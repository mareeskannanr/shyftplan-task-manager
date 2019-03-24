const utils = require('../utils');

module.exports = {

    async getAllTasks(req, res) {
        try {
            let queryString = `SELECT * FROM user_${req.session.user.id};`
            let result = await dbConnection.query(queryString);
            res.status(200).json(result.rows);
        } catch(e) {
            console.error(e);
            res.status(500).json({messge: 'Sorry, something went wrong!'});
        }
    },

    async saveTask(req, res) {
        try {
            let errors = await utils.validateTask(req.body);
            if(errors.length > 0) {
                return res.status(400).json(errors);
            }

            let queryString = `INSERT INTO user_${req.body.assignedTo} (start_time, end_time, description, created_by) VALUES ($1, $2, $3, $4);`;
            let task = req.body;
            await dbConnection.query(queryString, [task.startTime, task.endTime, task.description, req.session.user.id]);
            res.status(201).json({ "message": "Task Created Successfully!"});
        } catch(e) {
            console.error(e);
            res.status(500).json({messge: 'Sorry, something went wrong!'});
        }
    }

};