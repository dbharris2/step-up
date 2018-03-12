import TimeSeries from './time_series'

const Competition = `
  type Competition {
    _id: String
    average_steps: Int
    total_steps: Int
    users: [User]
    yesterdays_steps: Int
  }
`;

export default Competition;
