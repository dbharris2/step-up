import React, { Component } from 'react';
import './StepsCell.css';
import ProgressBar from "./ProgressBar";

class StepCell extends Component {

  render() {
    return (
      <div className="StepsCell-container">
        <div className="StepsCell-align-center StepsCell-flex StepsCell-half-width">
          <img
            className="StepsCell-rounded-corners StepsCell-margin-right"
            src={this.props.avatar}
            width={48}
            height={48}
          />
        {this.props.name}
        </div>
        <div className="StepsCell-grow StepsCell-left">
          <ProgressBar
            steps={this.props.steps}
            tiers={this.props.tiers}
          />
        </div>
      </div>
    );
  }
}

export default StepCell;
