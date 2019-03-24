import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
import axios from './axios';

export default class TaskModal extends Component {

    state = {
        task : {
            description: '',
            startTime: null,
            assignedTo: '',
            endTime: null
        },
        success: false,
        taskValid: false,
        timeInvalid: false,
        usersArray: []
    };

    componentDidMount() {
        axios.get('/api/users').then(result => this.setState({usersArray: result.data}))
            .catch(exception => {
                console.error(exception.response.data);
            });
    }

    taskOnChange(property, value) {
        let task = {...this.state.task};
        task[property] = value;
        
        let taskValid = task.description && task.startTime && task.endTime && task.assignedTo;
        let timeInvalid = task.startTime && task.endTime && new Date(task.startTime).getTime() > new Date(task.endTime).getTime();
        taskValid = taskValid && !timeInvalid;
        this.setState({task, taskValid, timeInvalid});
    }

    saveTask() {
        console.log(this.state.task);
        axios.post('/api/tasks', this.state.task)
            .then(result => {
                console.log(result);
                this.setState({success: true});
                setTimeout(this.props.closeModal.bind(this), 1500);
            })
            .catch(error => {
                console.error(error);
                this.props.closeModal(error.response.data);
            });
    }

    render() {
        return (
            <Modal isOpen={true}>
                <ModalHeader>
                    {!this.state.success && <span><span className="fas fa-tasks"></span> Add Task</span>}
                    {this.state.success && <span><span className="fas fa-thumbs-up"></span> Success</span>}
                </ModalHeader>
                <ModalBody>
                    {   this.state.success && 
                        <div className="col">
                            <h5 className="text-success">
                                Task Created Successfully!
                            </h5>
                        </div>
                    }
                    {
                        !this.state.success && 
                        <div>
                            <div className='col form-group'>
                                <label><b>Start Time</b></label><br />
                                <DatePicker selected={this.state.task.startTime} onChange={startTime => this.taskOnChange('startTime', startTime)} showTimeSelect className="form-control" dateFormat="Pp" required />
                            </div>
                            <div className='col form-group'>
                                <label><b>End Time</b></label><br />
                                <DatePicker selected={this.state.task.endTime} onChange={endTime => this.taskOnChange('endTime', endTime)} showTimeSelect className="form-control" dateFormat="Pp" required />
                                {this.state.timeInvalid && <small className='text-danger'><br />End Time must be greater than Start Time</small>}
                            </div>
                            <div className='col form-group'>
                                <label><b>Description</b></label>
                                <textarea className='form-control' value={this.state.task.description} onChange={event => this.taskOnChange('description', event.target.value)} required></textarea>
                            </div>
                            <div className='col form-group'>
                                <label><b>Assigned To</b></label>
                                <select className='form-control' value={this.state.task.assignedTo} onChange={event => this.taskOnChange('assignedTo', event.target.value)} required>
                                    <option></option>
                                    {
                                        this.state.usersArray.map((item, key) => <option key={key} value={item.id}>{item.email}</option>)
                                    }
                                </select>
                            </div>
                        </div>    
                    }
                    
                </ModalBody>
                <ModalFooter>
                    {!this.state.success && <div className="col-12 text-center">
                        <button type="button" className="btn btn-success" onClick={() => this.saveTask()} disabled={!this.state.taskValid}>
                            <span className="fas fa-save"></span> Add
                        </button>&nbsp;&nbsp;
                        <button type="button" className="btn btn-danger" onClick={() => this.props.closeModal()}>
                            <span className="fas fa-times"></span> Close
                        </button>
                    </div>}
                </ModalFooter>
            </Modal>
        );
    }

}