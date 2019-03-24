process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = require('assert');
const should = chai.should();

chai.use(chaiHttp);

const log = message => console.log(message);

describe('Create User with Invalid Data', () => {

    it('Should Return Required Validation Errors', done => {
        let user = {};
        chai.request(server).post('/api/signup').send(user).end((error, res) => {
            log(res.body);
            res.status.should.equal(400);
            res.body.length.should.equal(1);
            res.body[0].should.include.any.string("Email, User Name, Password, Confirm Password  are required.");
            done();
        });
    });
});

describe('User Model Validations', () => {
    it('Should Return Email Id Invalid, Password Mismatch Exception', done => {
        let user = {
            email: 'test',
            userName: 'test',
            password: 'test',
            confirmPassword: 'test1'
        };

        chai.request(server).post('/api/signup').send(user).end((error, res) => {
            log(res.body);
            res.status.should.equal(400);
            res.body.length.should.equal(2);
            res.body[0].should.include.any.string("Email  is invalid.");
            done();
        });

    });

    it('Check for duplicate email id', done => {
        let user = {
            email: 'testuser1@gmail.com',
            userName: 'Test User1',
            password: 'test1',
            confirmPassword: 'test1'
        };

        chai.request(server).post('/api/signup').send(user).end((error, res) => {
            res.body.message.should.equal('User Created Successfully!');
            res.status.should.equal(201);

            chai.request(server).post('/api/signup').send(user).end((err, response) => {
                log(response.body);
                response.status.should.equal(400);
                response.body.length.should.equal(1);
                response.body[0].should.include.any.string("User with Email testuser1@gmail.com Already Exists.");
                done();
            });

        });
    });

});

describe('Create Multipe Users and Get All Users', () => {
    before(done => {
        let user = {
            email: 'testuser2@gmail.com',
            userName: 'Test User2',
            password: 'test2',
            confirmPassword: 'test2'
        };
    
        chai.request(server).post('/api/signup').send(user).end((error, res) => {
            res.body.message.should.equal('User Created Successfully!');
            res.status.should.equal(201);
        });
    
        let user2 = {
            email: 'testuser3@gmail.com',
            userName: 'Test User3',
            password: 'test3',
            confirmPassword: 'test3'
        };
    
        chai.request(server).post('/api/signup').send(user2).end((err, res) => {
            log(res.body);
            res.body.message.should.equal('User Created Successfully!');
            res.status.should.equal(201);
            done();
        });
    });

    it('Should Render Login Page because of Unauthorized', done => {
        chai.request(server).get('/api/users')
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.have.html;
                res.redirects[0].should.includes('/login');
                done();
            });
    });

    it('Should Returns All The Users', done => {
        let header = 'Basic ' + Buffer.from('testuser1@gmail.com:test1').toString('base64');
        chai.request(server).get('/api/users')
            .set('authorization', header)
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.length.should.equal(3);
                log(res.body);
                done();
            });
    });

    it('Should Redirect to task-manager Page as Authentication', done => {
        chai.request(server).post('/api/login')
            .send({email: 'testuser1@gmail.com', password: 'test1'})
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.have.html;
                res.redirects[0].should.includes('/task-manager');
                done();
            });
    });

});