import TimeSeries from './time_series'

const Competition = `
  type Competition {
    _id: String
    average_steps: Int
    days_in: Int
    end_date: String
    length: Int
    start_date: String
    total_steps: Int
    users: [User]
    yesterdays_steps: Int
  }
`;

export default Competition;
