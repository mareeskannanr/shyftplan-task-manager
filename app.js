const express = require('express');
const logger = require('morgan');
const ejs = require('ejs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const config = require('./config');
const setup = require('./setup');

const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const viewRoutes = require('./routes/views');

const PORT = process.env.PORT || config.PORT;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.enable('trust proxy');
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));

app.use(cookieParser());
app.use(session({
    key: config.COOKIE_KEY,
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 24 * 60 * 60 * 1000
    }
}));

app.use('/', viewRoutes);
app.use('/api/', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/ui/build/"));

// route for handling 404 requests(unavailable routes)
app.use((req, res) => res.status(404).send("Sorry can't find that!"));

app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.set('views', [__dirname + '/public/views', __dirname + '/ui/build']);

setup.doInitialSetup().then(connection => {
    
    //Only one connection established for entire application, can be access from anywhere in the application
    global.dbConnection = connection;
    app.listen(PORT, () => {
        console.log(`Task Manager Application is running on port ${PORT}`);
        
        //To Indicate Test Cases to begin
        app.emit("app_started");
    });
}).catch(error => {
    //console.error(error);
    console.error('Due to Data Connection Problem, Server not get started!');
});

//For Testing
module.exports = app;