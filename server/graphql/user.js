import Profile from './profile'
import TimeSeries from './time_series'

const User = `
  type User {
    _id: String
    average_steps: Int
    profile: Profile
    time_series: [TimeSeries]
    total_steps: Int
    user_id: String
    yesterdays_steps: Int
  }
`;

export default User;
