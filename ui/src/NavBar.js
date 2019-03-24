import React from 'react';

const NavBar = (props) => (
    <nav className="navbar navbar-expand-sm bg-light navbar-light justify-content-end">
        <a className="navbar-brand">
          <img src="images/shyftplan.png" width="150px"/>
        </a>
        <div className='ml-auto'>
            <div className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                <b><span className='fas fa-2x fa-user'></span> {props.userName}</b> <b className="fas fa-caret"></b>
                </a>
                <div className="dropdown-menu" style={{"width": "100%"}}>
                    <a className="dropdown-item" href="/logout"><b><i className="fas fa-sign-out-alt"></i> Logout</b></a>
                </div>
            </div>
        </div>
    </nav>
);

export default NavBar;