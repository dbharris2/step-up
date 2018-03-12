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
      competition: null,
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
    const total_steps_tiers = [200000, 215000, 225000];
    const day_step_tiers = [10000, 12500, 15000];

    if (this.state.competition !== null) {
      const mobileUI = () => {
        return (
          <div className="App-cards">
            <StepsCard
              title="Total Steps"
              users={this.state.competition.users}
              team={this.state.competition.total_steps}
              tiers={total_steps_tiers}
              teamTiers={total_steps_tiers.map(tier => tier * this.state.competition.users.length)}
              stepsForUser={user => user.total_steps.value}
            />
            <StepsCard
              title="Yesterday's Steps"
              users={this.state.competition.users}
              team={this.state.competition.yesterdays_steps}
              tiers={day_step_tiers}
              teamTiers={day_step_tiers.map(tier => tier * this.state.competition.users.length)}
              stepsForUser={user => user.yesterdays_steps.value}
            />
            <StepsCard
              title="Average Steps"
              users={this.state.competition.users}
              team={this.state.competition.average_steps}
              tiers={day_step_tiers}
              teamTiers={day_step_tiers.map(tier => tier * this.state.competition.users.length)}
              stepsForUser={user => user.average_steps.value}
            />
          </div>
        );
      };

      const desktopUI = () => {
        return (
          <Flexbox flexDirection="row" alignItems="center">
            <ParticipantLeaderboard
              totalStepTiers={total_steps_tiers}
              dayStepTiers={day_step_tiers}
              competition={this.state.competition}
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
          query Competition {
            competition {
              average_steps
              total_steps
              yesterdays_steps
              users {
                user_id
                average_steps {
                  value
                }
                total_steps {
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
                  user_id
                }
                yesterdays_steps {
                  date
                  value
                }
              }
            }
          }`,
      }).then(res => {
        this.setState({competition: res.data.competition});
      });
      return (<div></div>);
    }
  }
}

export default App;
