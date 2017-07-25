import React, { Component, PropTypes } from 'react';
 
export default class Exam extends Component {
  render() {
    return (
      <li>{this.props.exam.year} {this.props.exam.subject} {this.props.exam.language} {this.props.exam.score} {this.props.exam.count} {this.props.exam.percent}  {this.props.exam.average}
      </li>
    );
  }
}
 
Exam.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  exam: PropTypes.object.isRequired,
};