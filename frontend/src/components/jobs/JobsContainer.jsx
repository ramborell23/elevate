// container to hold jobsummary and joblist

import React, { Component } from 'react';
import AddJobForm from './forms/AddJobForm.jsx';
import UpdateJobForm from './forms/UpdateJobForm.jsx';
import JobList from './JobList.jsx';
import JobSummary from './JobSummary.jsx';
import '../../stylesheets/jobs-main.css';

class JobsContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="jobs-container">
        <JobSummary activeUser={this.props.activeUser} />
        <JobList activeUser={this.props.activeUser} />
      </div>
    );
  }
}

export default JobsContainer;
