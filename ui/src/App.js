import React, { Component } from 'react';

import NavBar from './NavBar';
import Message from './Message';
import TaskList from './TaskList';
import TaskModal from './TaskModal';

import axios from './axios';

class App extends Component {

  state = {
    tasks: [],
    open: false,
    error: '',
    userName: ''
  };

  componentDidMount() {
    this.getAllTasks();
    this.getUserName();
  }

  getUserName() {
    axios.get('/api/userName').then(result => this.setState({userName: result.data.userName}));
  }

  getAllTasks() {
    axios.get('/api/tasks').then(result => this.setState({tasks: result.data, open: false}));
  }

  closeModal(error) {
    if(error) {
      this.setState({error, open: false});
    } else {
      this.getAllTasks();
    }
  }

  render() {
    return (
      <div className='row'>
        <div className='col-12' style={{"marginBottom":"10px", "marginTop": "5px"}}>
          <NavBar userName={this.state.userName} />
        </div>
        <div className='col-12' style={{"marginTop": "20px"}}>
          <div className="alert alert-dark" role="alert">
            <h2>
              <span>
                <span className="fas fa-list"></span> Task Manager
              </span>
              <button type="button" className="btn btn-success float-right" onClick={() => this.setState({open: true})}>
                <span className="fas fa-plus"></span> Task
              </button>
            </h2>
          </div>
        </div>

        <div className='col-12 text-center' style={{"marginTop": "15px"}}>
          { this.state.error ? <Message data={this.state.error} /> : this.state.tasks && this.state.tasks.length > 0 ? <TaskList tasks={this.state.tasks} />  : <Message data="" />} 
        </div>
        {this.state.open ? <TaskModal closeModal={(error, message) => this.closeModal(error, message)} /> : ''}

      </div>
    );
  }
}

export default App;
