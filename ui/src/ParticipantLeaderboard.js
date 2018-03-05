import React, { Component } from 'react';
import './ParticipantLeaderboard.css';
import _ from "lodash"
import ProgressBar from "./ProgressBar";

class ParticipantLeaderboard extends Component {
  render() {
    let contestantRows = [];
    let averageTiers = _.map(this.props.tiers, 'average');
    let totalTiers = _.map(this.props.tiers, 'total')
    let yesterdayTiers = _.map(this.props.tiers, 'yesterday')
    for (let person of this.props.participantsInfo) {
      contestantRows.push(
        <tr key={person["id"]} className="ParticipantLeaderboard-table-row">
          <td key={0} className="ParticipantLeaderboard-cell"> {person["name"]} </td>
          <td key={1} className="ParticipantLeaderboard-cell"> <ProgressBar steps={person.yesterdays_steps} tiers={yesterdayTiers} /> </td>
          <td key={2} className="ParticipantLeaderboard-cell"> <ProgressBar steps={person["average"]} tiers={averageTiers} /> </td>
          <td key={3} className="ParticipantLeaderboard-cell"> <ProgressBar steps={person["total"]} tiers={totalTiers} /> </td>
        </tr>
      );
    }
    return (
      <div className="ParticipantLeaderboard">
      <h1> Participant Leaderboard </h1>
        <table className="ParticipantLeaderboard-table">
          <thead className="ParticipantLeaderboard-header">
            <tr key="head" className="ParticipantLeadboard-header-row">
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
              <td className="ParticipantLeaderboard-cell ParticipantLeaderboard-team-cell"> Total Team </td>
              <td className="ParticipantLeaderboard-cell"> <ProgressBar steps={this.props.teamStepInfo["yesterday"]} tiers={yesterdayTiers} /> </td>
              <td className="ParticipantLeaderboard-cell"> <ProgressBar steps={this.props.teamStepInfo["average"]} tiers={averageTiers} /> </td>
              <td className="ParticipantLeaderboard-cell"> <ProgressBar steps={this.props.teamStepInfo["total"]} tiers={totalTiers} /> </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default ParticipantLeaderboard;
