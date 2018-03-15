import React, { Component } from 'react';
import './App.css';
import Flexbox from 'flexbox-react';
import ParticipantLeaderboard from './ParticipantLeaderboard';
import GraphQL from './graphql';
import StepsCard from './StepsCard';
import CompetitionInfo from './CompetitionInfo';

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
    if (this.state.competition !== null) {
      const mobileUI = () => {
        return (
          <div className="App-cards">
            <StepsCard
              title="Total Steps"
              users={this.state.competition.users}
              team={this.state.competition.total_steps}
              tiers={this.state.competition.total_tiers}
              teamTiers={this.state.competition.total_tiers.map(tier =>
                tier * this.state.competition.users.length
              )}
              stepsForUser={user => user.total_steps}
            />
            <StepsCard
              title="Yesterday's Steps"
              users={this.state.competition.users}
              team={this.state.competition.yesterdays_steps}
              tiers={this.state.competition.individual_tiers}
              teamTiers={this.state.competition.individual_tiers.map(tier =>
                tier * this.state.competition.users.length
              )}
              stepsForUser={user => user.yesterdays_steps}
            />
            <StepsCard
              title="Average Steps"
              users={this.state.competition.users}
              team={this.state.competition.average_steps}
              tiers={this.state.competition.individual_tiers}
              teamTiers={this.state.competition.individual_tiers.map(tier =>
                tier * this.state.competition.users.length
              )}
              stepsForUser={user => user.average_steps}
            />
          </div>
        );
      };

      const desktopUI = () => {
        return (
          <Flexbox flexDirection="row" alignItems="center">
            <ParticipantLeaderboard
              totalStepTiers={this.state.competition.total_tiers}
              dayStepTiers={this.state.competition.individual_tiers}
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
          <CompetitionInfo competition={this.state.competition} />
          {this.state.width < 500 ? mobileUI() : desktopUI()}
        </Flexbox>
      );
    } else {
      GraphQL({
        query:`
          query Competition {
            competition {
              average_steps
              days_in
              end_date
              individual_tiers
              length
              start_date
              total_steps
              total_tiers
              users {
                average_steps
                profile {
                  avatar
                  displayName
                }
                time_series {
                  date
                  value
                }
                total_steps
                user_id
                yesterdays_steps
              }
              yesterdays_steps
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
