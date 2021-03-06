// Add Job Form

import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import ResumeUpload from './ResumeUpload.jsx';
import CoverLetterUpload from './CoverLetterUpload.jsx';
import JobStatus from './JobStatus.jsx';
import InterviewPrompt from './InterviewPrompt.jsx';
import JobSideBar from './JobSideBar.jsx';
import AddInterview from './AddInterview.jsx';
import JobSalary from './JobSalary.jsx';
import { Link } from 'react-router-dom';
import achieves from '../../achievements/checkForAchievements';
import '../../../stylesheets/jobs-add.css';
import Calendar from 'react-calendar';
import moment from 'moment'
import dotenv from 'dotenv';
dotenv.load();

const AutoSuggestStyling = {
  suggestionsList: { listStyle: 'none' }
};

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
  dd = '0' + dd;
}
if (mm < 10) {
  mm = '0' + mm;
}

today = yyyy + '-' + mm + '-' + dd;

class AddJobForm extends Component {
  constructor() {
    super();
    this.state = {
      company: '',
      suggestedCompanies: [],
      companyLogo: '',
      position: '',
      date_applied: '',
      url: '',
      applicationStage: 1,
      job_id: '',
      resume_url: '',
      cover_url: '',
      saved: false
    };
  }

  handleFirstSubmit = e => {
    e.preventDefault();
    let dateLogged = moment().utcOffset(-240).format("YYYY-MM-DD")
    console.log(dateLogged)
    const companyLogo = this.state.companyLogo
      ? this.state.companyLogo
      : 'https://i.imgur.com/gBiRInp.png';
    axios
      .post('/users/createJobApp', {
        company_name: this.state.company,
        company_logo: companyLogo,
        date_applied: this.state.date_applied,
        date_logged: dateLogged,
        job_email: this.state.email,
        job_phone_number: this.state.phoneNumber,
        position_title: this.state.position,
        progress_in_search: 2,
        job_status: 'awaiting',
        job_posting_url: this.state.url
      })
      .then(data => {
        achieves.checkJobNumber();
        this.props.updateExperience(100);
        this.setState({
          job_id: data.data.returned.job_id,
          saved: true,
          applicationStage: 2,
          companyLogo: companyLogo,
          job_status: 'awaiting'
        });
      })
      .catch(err => {
        console.log(err);
      });

    const { job_id } = this.state;
  };

  handleStatusChange = e => {
    const job_status = e.target.name;
    const { job_id } = this.state;
    if (job_status === 'rejected') {
      achieves.checkForFirstRejection()
    } else if (job_status === 'offered') {
      achieves.checkForFirstOffer()
    }
    axios
      .put('/users/updateJobStatus', {
        job_id: job_id,
        job_status: job_status
      })
      .then(this.setState({ job_status }))
      .catch(err => console.log(err));
  };

  updateJobProgress = (job_id, progress_in_search) => {
    axios
      .put('/users/updateJobProgress', {
        job_id: job_id,
        progress_in_search: progress_in_search
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleResumeInput = res => {
    let { job_id } = this.state;
    axios
      .put('/users/updateResume', {
        resume_url: res,
        job_id: job_id
      })
      .then(() => {
        this.setState({
          resume_url: res,
          applicationStage: 3
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          message: 'Error updating resume'
        });
      });
    this.updateJobProgress(job_id, 3);
    this.props.updateExperience(50);
  };

  handleCoverInput = res => {
    let { job_id } = this.state;
    axios
      .put('/users/updateCover', {
        cover_url: res,
        job_id: job_id
      })
      .then(() => {
        this.setState({
          cover_url: res,
          applicationStage: 4
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          message: 'Error updating cover letter'
        });
      });
    this.updateJobProgress(job_id, 4);
    this.props.updateExperience(50);
  };

  getSuggestions = value => {
    if (value.length > 2) {
      axios
        .get(
          `https://autocomplete.clearbit.com/v1/companies/suggest?query=${value}`
        )
        .then(res => this.setState({ suggestedCompanies: res.data }))
        .catch(err => {
          console.log('Error fetching suggestions for dropdown, message:', err);
        });
    }
  };

  renderSuggestion = suggestion => (
    <div name={suggestion.name} className="suggestion-container">
      <img
        style={{ width: '25px', height: '25px' }}
        className="suggestion-logo"
        src={suggestion.logo}
      />
      <p className="suggestion-name">{suggestion.name}</p>
    </div>
  );

  getSuggestionValue = suggestion => suggestion.name;

  handleCompanyInput = e => {
    this.setState({ company: e.target.value });
    if (this.state.company.length < 2) {
      this.setState({
        selectedCompany: '',
        companyLogo: ''
      });
    }
  };
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      companySuggestions: this.getSuggestions(value)
    });
  };
  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      companySuggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    this.setState({
      company: suggestionValue,
      companyLogo: suggestion.logo
    });
    this.onSuggestionsClearRequested();
  };
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDate = date => {
    moment(date).utcOffset(-240).format("YYYY-MM-DD")
    this.setState({ date_applied: date });
  };

  handleNewJob = e => {
    this.setState({
      company: '',
      suggestedCompanies: [],
      companyLogo: '',
      position: '',
      date_applied: '',
      url: '',
      applicationStage: 1,
      job_id: '',
      resume_url: '',
      cover_url: '',
      saved: false
    });
  };

  changeStage = e => {
    this.setState({ applicationStage: parseInt(e.target.id) });
  };

  handleSkipButton = e => {
    e.preventDefault();
    let { applicationStage } = this.state;
    applicationStage += 1;
    this.setState({ applicationStage });
  };

  handleInterviewPrompt = e => {
    e.preventDefault();
    let { applicationStage } = this.state;
    if (e.target.id === 'yes') {
      applicationStage += 1;
    } else if (e.target.id === 'no') {
      applicationStage += 2;
    }
    this.setState({ applicationStage });
  };

  renderJobSideBar = () => {
    const {
      company,
      companyLogo,
      date_applied,
      position,
      resume_url,
      cover_url
    } = this.state;

    return (
      <JobSideBar
        companyLogo={companyLogo}
        resume_url={resume_url}
        cover_url={cover_url}
        company={company}
        date_applied={date_applied}
        position={position}
      />
    );
  };

  renderStage = () => {
    const { applicationStage, job_id } = this.state;
    switch (applicationStage) {
      case 2:
        return (
          <ResumeUpload
            handleResumeInput={this.handleResumeInput}
            job_id={job_id}
            handleSkipButton={this.handleSkipButton}
            formStatus={'add'}
          />
        );
        break;
      case 3:
        return (
          <CoverLetterUpload
            Upload
            handleCoverInput={this.handleCoverInput}
            handleSkipButton={this.handleSkipButton}
            job_id={job_id}
            formStatus={'add'}
          />
        );
      case 4:
        return (
          <InterviewPrompt handleInterviewPrompt={this.handleInterviewPrompt} />
        );
      case 5:
        return (
          <AddInterview
            job_id={job_id}
            updateExperience={this.props.updateExperience}
            saveInterview={this.saveInterview}
            addMoreInterview={this.addMoreInterview}
            handleSkipButton={this.handleSkipButton}
          />
        );
        break;
      case 6:
        return (
          <JobStatus
            handleStatusChange={this.handleStatusChange}
            job_status={this.state.job_status}
            handleSkipButton={this.handleSkipButton}
            handleNewJob={this.handleNewJob}
          />
        );
        break;
      case 7:
        return <JobSalary handleNewJob={this.handleNewJob} job_id={job_id} />;
    }
  };

  render() {
    const {
      company,
      companyLogo,
      suggestedCompanies,
      selectedCompany,
      position,
      email,
      date_applied,
      phoneNumber,
      url,
      resume_url,
      cover_url,
      job_id,
      saved,
      applicationStage,
      job_status
    } = this.state;

    const inputProps = {
      placeholder: `Company Name`,
      value: company,
      onChange: this.handleCompanyInput
    };

    return (
      <div className="add-job-form-container">
        <div hidden={applicationStage > 1 ? true : false}>
          <div data-aos="fade-up" className="add-job-info">
            <form onSubmit={this.handleFirstSubmit}>
              <h1>Job Application Information</h1>
              <h3>Let's start with the basics</h3>
              <div className="add-job-input-pairs-container">
                <div className="add-job-labels-container">
                  <p>Company *</p>
                  <p>Position *</p>
                  <div>
                    <p className="add-job-date-label">Date applied *</p>
                  </div>
                  <p>Job posting url</p>
                </div>
                <div className="add-job-inputs-container">
                  <div className="company-search-input">
                    <Autosuggest
                      className="add-job-form-input-company"
                      theme={AutoSuggestStyling}
                      suggestions={suggestedCompanies}
                      onSuggestionsFetchRequested={
                        this.onSuggestionsFetchRequested
                      }
                      onSuggestionsClearRequested={
                        this.onSuggestionsClearRequested
                      }
                      getSuggestionValue={this.getSuggestionValue}
                      onSuggestionSelected={this.onSuggestionSelected}
                      renderSuggestion={this.renderSuggestion}
                      inputProps={inputProps}
                    />
                    {companyLogo ? (
                      <img className="company-image" src={companyLogo} />
                    ) : (
                      <span className="magnifying-glass">
                        <i className="fas fa-search fa-2x" />
                      </span>
                    )}
                  </div>
                  <div className="position-search-input">
                    <div>
                      <input
                        onChange={this.handleInput}
                        value={position}
                        placeholder="Position"
                        name="position"
                        type="text"
                      />
                    </div>
                    <span className="brief-case">
                      <i className="fas fa-briefcase fa-2x" />
                    </span>
                  </div>
                  <div className="date-applied-input">
                    <Calendar onChange={this.handleDate} value={date_applied} />
                  </div>
                  <div className="job-posting-input">
                    <input
                      onChange={this.handleInput}
                      value={url}
                      placeholder="Url"
                      name="url"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div className="add-job-buttons">
                <input
                  disabled={saved || !company || !position || !date_applied}
                  type="submit"
                  value="Next"
                />
              </div>
            </form>
          </div>
        </div>
        {applicationStage > 1 ? (
          <div className="add-job-moving-stages-container">
            <this.renderJobSideBar />
            <this.renderStage />
          </div>
        ) : null}
      </div>
    );
  }
}

export default AddJobForm;
