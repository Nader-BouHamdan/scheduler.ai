import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskInput from './components/taskInput';
import Calendar from './components/Calendar';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/task-input" component={TaskInput} />
        <Route path="/calendar" component={Calendar} />
      </Switch>
    </Router>
  );
}

export default App;
