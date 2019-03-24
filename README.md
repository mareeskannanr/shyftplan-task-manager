

A Simple Task Manager Application using Node.js as BackEnd, React.js as FrontEnd, PostgreSQL database.

Pull this repository to your machine.

Ensure **PostgreSQL 9.5+** installed in your machine. Configure your database connection by modifing property _DB_CONNECTION_STRING_ in the config.json file. 

_e.g postgres://{YourUserName}:{YourPassword}@localhost:5432/{YourDatabase}_

Goto node-server folder run **npm i** , do npm audit fix if required.

By default server is running on port 3000, to use other ports use **_PORT=${your_port} npm start_**

Goto browser and Enter the URL **http://localhost:${your_port or 3000}**

To run server tests, navigate to node-server folder use **_npm test_**

User Interface already integrated with server, source code of it can be found in the folder **ui**

To run test for ui enter command _**npm test**_ after navigate to ui folder.

_screenshots_ folder contains snaps captured from my machine while testing, please gothroughit for your reference.

some of screenshots:

<p float='left'>
    <img width="48%" height="300" src="screenshots/UI/1.png">
    <img width="48%" height="300" src="screenshots/UI/2.png">
</p>
<p float='left'>
    <img width="48%" height="300" src="screenshots/UI/10.png">
    <img width="48%" height="300" src="screenshots/UI/12.png">
</p>
