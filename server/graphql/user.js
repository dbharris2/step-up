import TimeSeries from './time_series'

const User = `
  type User {
    _id: String
    time_series: [TimeSeries]
    user_id: String
  }
`;

export default User;
