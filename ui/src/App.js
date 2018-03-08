import React, { Component } from 'react';
import './App.css';
import Flexbox from 'flexbox-react';
import ParticipantLeaderboard from './ParticipantLeaderboard';
import GraphQL from './graphql';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
    }
  }

  render() {
    let tiers = [
      {"average": 10000, "total": 200000, "yesterday": 10000,},
      {"average": 12500, "total": 215000, "yesterday": 12500,},
      {"average": 25000, "total": 430000, "yesterday": 25000,},
    ];

    if (this.state.users !== null && this.state.users.length > 0) {
      const participants_info = this.state.users.map(user => {
        return {
          avatar: user.profile.avatar,
          average: parseInt(user.average_steps.value),
          id: user.user_id,
          name: user.profile.displayName,
          total: parseInt(user.total_steps.value),
          yesterdays_steps: parseInt(user.yesterdays_steps.value),
        };
      });

      const team_step_info = participants_info.reduce(
        (accumulator, participant_info) => {
          return {
            "average": accumulator.average + participant_info.average,
            "total": accumulator.total + participant_info.total,
            "yesterday": accumulator.yesterday + participant_info.yesterdays_steps,
          };
        },
        {
          "average": 0,
          "total": 0,
          "yesterday": 0,
        },
      );

      return (
        <Flexbox alignItems="stretch" flexDirection="column">
          <Flexbox
            alignItems="center"
            className="App-header"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
            >
            <h2>Step Challenge 2018</h2>
            <a className="App-join" href="/authenticate">Join the Fun!</a>
          </Flexbox>
          <Flexbox flexDirection="row">
            <ParticipantLeaderboard
              tiers={tiers}
              teamStepInfo={team_step_info}
              participantsInfo={participants_info}
              loggedInUser={1}
            />
          </Flexbox>
        </Flexbox>
      )
    } else {
      GraphQL({
        query:`
          query Users {
            users {
              _id
              user_id
              average_steps {
                value
              }
              profile {
                avatar
                displayName
                user_id
              }
              time_series {
                date
                value
              }
              total_steps {
                value
              }
              yesterdays_steps {
                date
                value
              }
            }
          }`,
      }).then(res => {
        this.setState({users: res.data.users});
      });
      return (<div></div>);
    }
  }
}

export default App;
