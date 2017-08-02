import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import ReactDOM from 'react-dom';

import { Exams } from '../api/exams.js';

import ExamResults from './ExamResults';

// App component - represents the whole app
class App extends Component {
  render() {
     return (
      <div className="container">
         { this.props.loading ?  "" : <ExamResults data={this.props.exams}/>}
      </div>
    );
  }
}

App.propTypes = {
  exams: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  const subscription = Meteor.subscribe('exams');
  const loading = !subscription.ready();
  return {
    exams: Exams.find({}).fetch(),
    loading: loading
  };
}, App);