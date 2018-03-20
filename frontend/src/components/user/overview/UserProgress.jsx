// Add Job Form

import React, { Component } from 'react';

class UserProgress extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="user-progress-container">
        {/* <h3>Progress</h3> */}
        <div className="user-progress-header">
          <h3>User Progress</h3>
        </div>
        <div className="user-progress-content">
          <div className="user-progress-left">
            <div className="user-progress-badge-container">
              <img src="https://lh3.googleusercontent.com/1GmLSLTSH4LmI-xD5ZAYIG3DkJ4GVhAF15UbwzuPm2UgM0MvHR05_attKfkyOzJmS6kNfEXqO0wWzIzRP-FJ=w1438-h780" alt="badge" class="user-progress-badge" />
              <img src="https://lh3.googleusercontent.com/1GmLSLTSH4LmI-xD5ZAYIG3DkJ4GVhAF15UbwzuPm2UgM0MvHR05_attKfkyOzJmS6kNfEXqO0wWzIzRP-FJ=w1438-h780" alt="badge" class="user-progress-badge" />
            </div>
            <div className="user-progress-bar-container">
            </div>
          </div>
          <div className="user-progress-right">
            <h3>Current Level</h3>
            <h3>Next Level</h3>
            <p>XXX more to next level!</p>
          </div>

        </div>
      </div>
    )
  }
}

export default UserProgress;
