import React, { Component } from 'react';
import "./CompetitionInfo.css"

class CompetitionInfo extends Component {

    render() {
      return (
        <div className="CompetitionInfo-container">
          <div className="CompetitionInfo-space-around">
            <div>
              Start: {this.props.competition.start_date}
            </div>
            <div>
              Days In: {this.props.competition.days_in} days
            </div>
          </div>
          <div className="CompetitionInfo-space-around">
            <div>
              End: {this.props.competition.end_date}
            </div>
            <div>
              Days Left: {this.props.competition.length - this.props.competition.days_in} days
            </div>
          </div>
        </div>
      );
    }
}

export default CompetitionInfo;
