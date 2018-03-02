import React, { Component } from 'react';
import './App.css';
import ParticipantLeaderboard from './ParticipantLeaderboard';

class App extends Component {
  render() {
    let tiers = [{
      "average": 10000,
      "total": 100000,
    },{
      "average": 12500,
      "total": 125000,
    },{
      "average": 15000,
      "total": 150000,
    }];

    let teamStepInfo = {
      "average": 13101,
      "total": 100101,
    };

    let participantInfo = [{
      name: "Caroline Modic",
      average: 12510,
      total: 52130,
      id: 1
    }, {
      name: "Devon Harris",
      average: 10101,
      total: 45971,
      id: 2
    }, {
      name: "Emma ???",
      average: 132,
      total: 2000,
      id: 3
    }];

    return (
      <ParticipantLeaderboard
        tiers={tiers}
        teamStepInfo={teamStepInfo}
        participantsInfo={participantInfo}
        loggedInUser={1}
      />
    )
  }
}

export default App;
