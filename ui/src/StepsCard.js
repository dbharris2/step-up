import React, { Component } from 'react';
import StepsCell from "./StepsCell";

class StepsCard extends Component {

  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        {this.props.users.map(user =>
          <StepsCell
            avatar={user.profile.avatar}
            name={user.profile.displayName}
            steps={this.props.stepsForUser(user)}
            tiers={this.props.tiers}
          />)}
      </div>
    );
  }
}

export default StepsCard;
