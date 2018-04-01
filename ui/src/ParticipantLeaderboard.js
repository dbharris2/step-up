import Flexbox from 'flexbox-react';
import React, { Component } from 'react';
import './ParticipantLeaderboard.css';
import ProgressBar from "./ProgressBar";

const EVERYONE_ICON = "https://im-01.gifer.com/J4dN.gif";

class ParticipantLeaderboard extends Component {
  render() {
    let contestantRows = [];
    let i = 1;
    for (let person of this.props.competition.users) {
      contestantRows.push(
        <tr key={person["id"]} className="ParticipantLeaderboard-table-row">
          <td>
            {i}
          </td>
          <td>
            <Flexbox key={0} className="ParticipantLeaderboard-cell" alignItems="center">
              <img className="ParticipantLeaderboard-rounded-corners" src={person.profile.avatar} width={48} height={48} hspace={8} />
              {person.profile.displayName}
            </Flexbox>
          </td>
          <td key={1} className="ParticipantLeaderboard-cell">
            <ProgressBar
              steps={person.yesterdays_steps}
              tiers={this.props.dayStepTiers}
            />
          </td>
          <td key={2} className="ParticipantLeaderboard-cell">
            <ProgressBar
              steps={person.average_steps}
              tiers={this.props.dayStepTiers}
            />
          </td>
          <td key={3} className="ParticipantLeaderboard-cell">
            <ProgressBar
              steps={person.total_steps}
              tiers={this.props.totalStepTiers}
            />
          </td>
        </tr>
      );
      i++;
    }
    return (
      <div className="ParticipantLeaderboard">
      <h1> Participant Leaderboard </h1>
        <table className="ParticipantLeaderboard-table">
          <thead className="ParticipantLeaderboard-header">
            <tr key="head" className="ParticipantLeadboard-header-row">
              <td className="ParticipantLeaderboard-header-cell ParticipantLeaderboard-cell"> Rank </td>
              <td className="ParticipantLeaderboard-header-cell ParticipantLeaderboard-cell"> Name </td>
              <td className="ParticipantLeaderboard-header-cell ParticipantLeaderboard-cell"> Yesterdays Steps </td>
              <td className="ParticipantLeaderboard-header-cell ParticipantLeaderboard-cell"> Average Steps </td>
              <td className="ParticipantLeaderboard-header-cell ParticipantLeaderboard-cell"> Total Steps </td>
            </tr>
          </thead>
          <tbody className="ParticipantLeaderboard-table-body">
            {contestantRows}
          </tbody>
          <tfoot className="ParticipantLeaderboard-footer">
            <tr key="team" className="ParticipantLeaderboard-table-row">
              <td></td>
              <td>
                <Flexbox key={0} className="ParticipantLeaderboard-cell" alignItems="center">
                  <img className="ParticipantLeaderboard-rounded-corners" src={EVERYONE_ICON} width={48} height={48} hspace={8} />
                  {"Total Team"}
                </Flexbox>
              </td>
              <td className="ParticipantLeaderboard-cell">
                <ProgressBar
                  steps={this.props.competition.yesterdays_steps}
                  tiers={this.props.dayStepTiers.map(tier => tier * this.props.competition.users.length)}
                />
              </td>
              <td className="ParticipantLeaderboard-cell">
                <ProgressBar
                  steps={this.props.competition.average_steps}
                  tiers={this.props.dayStepTiers.map(tier => tier * this.props.competition.users.length)}
                />
              </td>
              <td className="ParticipantLeaderboard-cell">
                <ProgressBar
                  steps={this.props.competition.total_steps}
                  tiers={this.props.totalStepTiers.map(tier => tier * this.props.competition.users.length)}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default ParticipantLeaderboard;
