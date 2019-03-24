const utils = require('./utils');

module.exports = {
    isAuthenticated(req, res, next) {
        if(req.session.user) {
            return next();
        }

        /*** To Serve Rest Clients ****/
        if(req.headers["authorization"] && req.headers["authorization"].trim()) {
            let header = req.headers["authorization"];
            let credentials = Buffer.from((header).split(" ")[1], 'base64').toString();
            credentials = credentials.split(':');
            credentials = { email: credentials[0], password: credentials[1] };
            let errors = utils.validateCredentials(credentials);
            if(errors.length > 0) {
                return res.status(400).json(errors);
            }

            return utils.authenticateUser(credentials)
                    .then(result => {
                        req.session.user = result;
                        next();
                    })
                    .catch(e => utils.handleAuthenicateException(e, req, res));
        }
        
        res.redirect('/login');
    }
};