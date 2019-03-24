import React from 'react';
import ReactDOM from 'react-dom';
import {shallow, mount, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16.3';
configure({ adapter: new Adapter() });

import App from './App';
import Message from './Message';
import NavBar from './NavBar';
import TaskList from './TaskList';
import TaskModal from './TaskModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Message without data', () => {
  const component = shallow(<Message/>);
  expect(component).toMatchSnapshot();
});

it('Message with data', () => {
  const component = shallow(<Message data="success" />);
  expect(component).toMatchSnapshot();
});

it('Navbar without UserName', () => {
  const component = shallow(<NavBar />);
  expect(component).toMatchSnapshot();
});

it('Navbar with UserName', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NavBar userName="Test" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('TaskList tasks', () => {
  const div = document.createElement('div');
  let tasks = [{
    start_time: new Date(),
    end_time: new Date(),
    description: "test"
  }];
  ReactDOM.render(<TaskList tasks={tasks}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('TaskModal render without crash', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TaskModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});