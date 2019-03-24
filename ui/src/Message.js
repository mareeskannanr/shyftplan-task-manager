import React from 'react';

let Message = props => (
    <div className="row" style={{"marginTop": "10vh"}}>
        <div className="col my-auto">
            <div className="mx-auto">
                {
                    props.data ? <h3 className="text-danger">{props.data}</h3> : <h3 className="text-info">Your Task List is emplty!</h3> 
                }
            </div>
        </div>
    </div>
);

export default Message;
