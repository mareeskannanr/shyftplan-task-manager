process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = require('assert');
const should = chai.should();

before(done => {
    server.on("app_started", () => done());
});

chai.use(chaiHttp);

const log = message => console.log(message);

describe('Get LogIn Page', () => {
    it('Should Render login.html with LogIn Form', done => {
        chai.request(server).get('/login').end((error, res) => {
            res.should.have.status(200);
            res.should.have.html;
            done();
        });
    });
});

describe('Get SignUp Page', () => {
    it('Should Return login.html with SignUp Form', done => {
        chai.request(server).get('/signup').end((error, res) => {
            res.should.have.status(200);
            res.should.have.html;
            done();
        });
    });
});

describe('Get SignUp Page Redirect To LogIn Page', () => {
    it('Should Return to LogIn becuse no credentials provided', done => {
        chai.request(server).get('/task-manager').end((error, res) => {
            res.should.have.status(200);
            res.should.have.html;
            res.redirects[0].should.includes('/login');
            done();
        });
    });
});

describe('Unknown Url', () => {
    it('Should Return 404 Status Code', done => {
        chai.request(server).post('/test').end((error, res) => {
            log(res.body);
            res.status.should.equal(404);
            done();
        });
    });
});