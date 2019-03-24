import React, { Component } from 'react';

export default class TaskList extends Component {

    headerArray = ["Start Time", "End Time", "Description"];

    formatDateTime(date) {
        date = new Date(date);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let timeString = hours + ':' + minutes + ' ' + ampm;
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "  " + timeString;
      }

    render() {
        return (
            <div className="row">
                <div className="col">
                    <table className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                {this.headerArray.map(header => <th key={header}>{header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.tasks.map((row, index) =>
                                    <tr key={index}>
                                        <td>{this.formatDateTime(row.start_time)}</td>
                                        <td>{this.formatDateTime(row.end_time)}</td>
                                        <td>{row.description}</td>
                                    </tr>
                                )    
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}