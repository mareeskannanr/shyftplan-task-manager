const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const setup = require('../setup');
const assert = require('assert');
const should = chai.should();
const be = chai.be;
const an = chai.an;

chai.use(chaiHttp);

const log = message => console.log(message);

describe('Create Tasks Test Cases', () => {

    it('Should return exception for empty task', done => {
        let header = 'Basic ' + Buffer.from('testuser1@gmail.com:test1').toString('base64');
        
        chai.request(server).post('/api/tasks')
            .set('authorization', header).send({})
            .end((err, res) => {
                res.status.should.equal(400);
                res.body.length.should.equal(4);
                res.body[0].should.include.any.string("Description is required.");
                done();
            });
    });

    it('Should return exception for start date greater than end date', done => {
        let header = 'Basic ' + Buffer.from('testuser1@gmail.com:test1').toString('base64');
        let task = {
            description: 'test',
            startTime: '2019-03-01',
            endTime: '2019-01-01',
            assignedTo: 1
        };

        chai.request(server).post('/api/tasks')
            .set('authorization', header).send(task)
            .end((err, res) => {
                //log(res.error);
                res.status.should.equal(400);
                res.body.length.should.equal(1);
                res.body[0].should.include.any.string("End Time must be greater than Start Time.");
                done();
            });
    });

    it('Should return exception for invalid assigned to', done => {
        let header = 'Basic ' + Buffer.from('testuser1@gmail.com:test1').toString('base64');
        let task = {
            description: 'test',
            startTime: '2019-03-01',
            endTime: '2019-03-01',
            assignedTo: 100
        };

        chai.request(server).post('/api/tasks')
            .set('authorization', header).send(task)
            .end((err, res) => {
                log(res.body);
                res.status.should.equal(400);
                res.body.length.should.equal(1);
                res.body[0].should.include.any.string("Assigned To User Doesn't exists in DB.");
                done();
            });
    });

    it('should return tasks assigned to testuser2 by testuser1', done => {
        let header = 'Basic ' + Buffer.from('testuser1@gmail.com:test1').toString('base64');

        let requests = [];
        for(let i=1; i<=5; i++) {
            let task = {
                description: `test task ${i}`,
                startTime: "2019-05-01",
                endTime: "2019-07-08",
                assignedTo: 2
            };

            requests.push(new Promise(async (resolve, reject) => {
                chai.request(server).post('/api/tasks').set('authorization', header).send(task).end(resolve(''));
            }));
        }

        setTimeout(() => {
            header = 'Basic ' + Buffer.from('testuser2@gmail.com:test2').toString('base64');
            Promise.all(requests).then(() => {
                chai.request(server).get('/api/tasks')
                .set('authorization', header)
                .end((err, res) => {
                    log(res.body);
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    chai.assert.isTrue(res.body.length === 5);
                    done();
                });
            });
        }, 1500);
    });

    after(done => {
        console.log('Test Completed Successfully!');
        done();
    });

});