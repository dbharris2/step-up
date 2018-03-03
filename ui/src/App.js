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
      {"average": 10000, "total": 200000,},
      {"average": 12500, "total": 215000,},
      {"average": 25000, "total": 430000,},
    ];

    if (this.state.users !== null && this.state.users.length > 0) {
      const participants_info = this.state.users.map(user => {
        const total_steps = user.time_series.reduce(
          (accumulator, entry) => accumulator + parseInt(entry.value),
          0,
        );
        return {
          average: Math.round(total_steps / user.time_series.length),
          id: user.user_id,
          name: user.profile.displayName,
          total: total_steps,
        };
      });

      const team_step_info = participants_info.reduce(
        (accumulator, participant_info) => {
          return {
            "average": accumulator.average + participant_info.average,
            "total": accumulator.total + participant_info.total,
          };
        },
        {
          "average": 0,
          "total": 0,
        },
      );

      return (
        <Flexbox alignItems="stretch" flexDirection="column">
          <Flexbox
            alignItems="center"
            className="App-header"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-around"
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
              profile {
                avatar
                displayName
                user_id
              }
              time_series {
                date
                value
                user_id
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
