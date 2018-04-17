import {
  formatDate,
  getEndOfCompetition,
  getLengthBetweenDates,
  getStartOfCompetition,
  getToday,
} from '../utils/date_helpers';


const competitionQueryResolvers = {
  competition: async (root, {}, context) => {
    const users = await context.db.collection('users').find({}).toArray();
    const time_series_responses = await context.db.collection('fitbit_time_series').find({}).toArray();

    const start_date = getStartOfCompetition();
    const end_date = getEndOfCompetition();
    const length = getLengthBetweenDates(start_date, end_date);
    const individual_tiers = [10000, 12500, 15000];

    const total_steps = time_series_responses.reduce((accumulator, time_series_response) => {
      return accumulator + time_series_response.time_series['activities-steps'].reduce((accumulator, data) => {
        return accumulator + parseInt(data.value);
      }, 0);
    }, 0);

    const desired_step_goal = 15000 * length * users.length;
    console.log(desired_step_goal);

    const steps_we_need_to_get = desired_step_goal - total_steps;
    console.log(steps_we_need_to_get);

    const days_still_remaining = getLengthBetweenDates(getToday(), end_date);
    console.log(days_still_remaining);

    return {
      average_steps: Math.round(time_series_responses.reduce((accumulator, time_series_response) => {
        return accumulator + time_series_response.time_series['activities-steps'].reduce((accumulator, data) => {
          return accumulator + parseInt(data.value);
        }, 0);
      }, 0) / (time_series_responses[0].time_series['activities-steps'].length * users.length)),
      days_in: getLengthBetweenDates(start_date, getToday()) + 1,
      end_date: end_date,
      individual_tiers: individual_tiers,
      length: length,
      start_date: start_date,
      steps_to_15k_per_user: Math.round(
        steps_we_need_to_get / (days_still_remaining * users.length)
      ),
      total_steps: total_steps,
      total_tiers: individual_tiers.map(tier => tier * length),
      users: users,
      yesterdays_steps: Math.round(time_series_responses.reduce((accumulator, time_series_response) => {
        return accumulator + parseInt(time_series_response.time_series['activities-steps'].pop().value);
      }, 0) / users.length),
    };
  },
};

export { competitionQueryResolvers }
