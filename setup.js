const { Client } = require('pg');

const config = require('./config');
const utils = require('./utils');

module.exports = {
    async doInitialSetup() {
        try {
            let dbConnection = await this.getDBConnection();

            if(process.env.NODE_ENV != 'production') {
                let databaseName = process.env.MODE === 'TEST' ? config.TEST_DB : config.TASK_MANAGER;
                if(process.env.MODE === 'TEST') {
                    await this.deleteTestDB(dbConnection);
                }

                await this.createTaskManagerDB(dbConnection, databaseName);

                dbConnection = await this.connectTaskManagerDB(databaseName);
            }

            await utils.readSchemas();

            await this.createUserTable(dbConnection);

            return dbConnection;
        } catch(e) {
            console.error(e);
            throw e;
        }
    },

    async getDBConnection() {
        let client = new Client({
            connectionString: process.env.HEROKU_POSTGRESQL_BLUE_URL || (config.DB_CONNECTION_STRING + config.POSTGRES)
        });

        console.log(process.env.HEROKU_POSTGRESQL_BLUE_URL);
        console.log('*********************');
        for(let prop in process.env) {
            console.log(prop);
        }

        let promise = new Promise((resolve, reject) => {
            client.connect((err, connection) => {
                if(err) {
                    reject(new Error(err));
                }
    
                resolve(connection);
            });
        });

        return await promise.then(result => { return result; }).catch(e => {
            console.error(e);
            throw new Error('Error occured while connecting to Task DB');
        });
    },

    async createTaskManagerDB(dbConnection, databaseName) {
        try {

            let queryString = 'SELECT 1 AS RESULT FROM pg_database WHERE datname=$1';
            let result = await dbConnection.query(queryString, [databaseName]);
            if(result.rows.length == 0) {
                queryString = `CREATE DATABASE ${databaseName}`;
                result = await dbConnection.query(queryString);
                dbConnection.end();
            }

        } catch(e) {
            console.error(e);
            throw new Error('Exception occured while Creating Task Manager DB');
        }

    },

    async connectTaskManagerDB(databaseName) {
        let connectionString = config.DB_CONNECTION_STRING + databaseName;
        let client = new Client({connectionString});

        let promise = new Promise((resolve, reject) => {
            client.connect((err, connection) => {
                if(err) {
                    reject(new Error(err));
                }
    
                resolve(connection);
            });
        });

        return await promise.then(result => { return result; }).catch(e => { 
            console.error(e);
            throw new Error('Error occured while connecting to Task DB'); 
        });
    },

    async createUserTable(dbConnection) {
        try {

            let queryString = "SELECT to_regclass('public.users') AS table_exists;";
            let result = await dbConnection.query(queryString);
            if(result.rows[0].table_exists) {
                return;
            }

            let userTableQuery = modelTemplate.users;
            await dbConnection.query(userTableQuery);
            console.log('Initial Setup Completed Successfully!');
        } catch(e) {
            console.error(e);
            throw new Error('Exception While Creating Users Table');
        } 
    },

    async deleteTestDB(dbConnection) {
        try {
            let queryString = `DROP DATABASE IF EXISTS ${config.TEST_DB}`;
            await dbConnection.query(queryString);
        } catch(e) {
            console.log(e);
            throw new Error('Exception While Deleting Test DB');
        }
    }
};