const { Router } = require('express');
const router = Router();

const { isAuthenticated } = require('../middleware');
const controller = require('../controllers/users');

router.route('/signup').post(controller.registerUserInfo);

router.route('/login').post(controller.loginUser);

router.route('/users').get(isAuthenticated, controller.getAllUsers);

router.route('/userName').get((req, res) => res.json({userName: req.session.user.user_name }));

module.exports = router;