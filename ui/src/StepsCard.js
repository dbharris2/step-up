import React, { Component } from 'react';
import StepsCell from "./StepsCell";
import './StepsCard.css';

class StepsCard extends Component {

  render() {
    return (
      <div className="StepsCard-Container">
        <h3>{this.props.title}</h3>
        {this.props.users.map(user =>
          <StepsCell
            avatar={user.profile.avatar}
            key={user.user_id}
            name={user.profile.displayName}
            steps={this.props.stepsForUser(user)}
            tiers={this.props.tiers}
          />)}
        <StepsCell
          avatar="https://im-01.gifer.com/J4dN.gif"
          name="Team"
          steps={this.props.team}
          tiers={this.props.teamTiers}
        />
      </div>
    );
  }
}

export default StepsCard;
