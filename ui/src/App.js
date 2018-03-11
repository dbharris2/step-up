import React, { Component } from 'react';
import './App.css';
import Flexbox from 'flexbox-react';
import ParticipantLeaderboard from './ParticipantLeaderboard';
import GraphQL from './graphql';
import StepsCard from './StepsCard'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      width: window.innerWidth,
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

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

      const mobileUI = () => {
        return (
          <div className="App-cards">
            <StepsCard
              title="Total Steps"
              users={this.state.users}
              tiers={[200000, 215000, 225000]}
              stepsForUser={user => user.total_steps.value}
            />
            <StepsCard
              title="Yesterday's Steps"
              users={this.state.users}
              tiers={[10000, 12500, 15000]}
              stepsForUser={user => user.yesterdays_steps.value}
            />
            <StepsCard
              title="Average Steps"
              users={this.state.users}
              tiers={[10000, 12500, 15000]}
              stepsForUser={user => user.average_steps.value}
            />
          </div>
        );
      };

      const desktopUI = () => {
        return (
          <Flexbox flexDirection="row" alignItems="center">
            <ParticipantLeaderboard
              tiers={tiers}
              teamStepInfo={team_step_info}
              participantsInfo={participants_info}
              loggedInUser={1}
            />
          </Flexbox>
        );
      };

      return (
        <Flexbox alignItems="stretch" flexDirection="column">
          <Flexbox className="App-header" justifyContent="space-between" alignItems="center">
            <h4>Steps 4 Days</h4>
            <a className="App-join" href="/authenticate">Join the Fun!</a>
          </Flexbox>
          {this.state.width < 500 ? mobileUI() : desktopUI()}
        </Flexbox>
      );
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
