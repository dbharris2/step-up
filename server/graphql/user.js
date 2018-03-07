import Profile from './profile'
import TimeSeries from './time_series'

const User = `
  type User {
    _id: String
    average_steps: TimeSeries
    profile: Profile
    time_series: [TimeSeries]
    total_steps: TimeSeries
    user_id: String
    yesterdays_steps: TimeSeries
  }
`;

export default User;
