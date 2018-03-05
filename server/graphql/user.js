import Profile from './profile'
import TimeSeries from './time_series'

const User = `
  type User {
    _id: String
    profile: Profile
    time_series: [TimeSeries]
    user_id: String
    yesterdays_steps: TimeSeries
  }
`;

export default User;
