const { Router } = require('express');
const router = Router();

const { isAuthenticated } = require('../middleware');
const controller = require('../controllers/tasks');

router.route('/')
    .post(isAuthenticated, controller.saveTask)
    .get(isAuthenticated, controller.getAllTasks);

module.exports = router;