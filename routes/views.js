const { Router } = require('express');
const router = Router();
const path = require('path');

const { isAuthenticated } = require('../middleware');

router.route('/login').get((req, res) => {
    let errors = req.session.errors || '';
    let successMsg = req.session.successMsg || '';
    delete req.session.errors;
    delete req.session.successMsg;

    res.render('login.html', { type: 'login', errors, successMsg });
});

router.route('/logout').get((req, res) => {
    delete req.session.user;
    res.redirect('/login');
});

router.route('/signup').get((req, res) => {
    let errors = [...(req.session.errors || [])];
    let successMsg = req.session.successMsg || '';
    
    delete req.session.errors;
    delete req.session.successMsg;
    res.render('login.html', { type: 'sign-up', errors, successMsg });
});   

router.route('/task-manager').get(isAuthenticated, (req, res) => {
    res.render('index.html', {
        userName: req.session.user.user_name
    });
}); 

router.route('/').get(isAuthenticated, (req, res) => res.redirect('/task-manager'));

module.exports = router;