import DateDiff from 'date-diff';

function format_date(date) {
  return (date.getMonth() + 1) + '/' + (date.getDate() + 1) + '/' + date.getFullYear();
}

const competitionQueryResolvers = {
  competition: async (root, {}, context) => {
    const users = await context.db.collection('users').find({}).toArray();
    const time_series_responses = await context.db.collection('fitbit_time_series').find({}).toArray();
    const competition_length = time_series_responses[0].time_series['activities-steps'].length;

    const start_date = new Date("2017-04-20");
    const end_date = new Date("2017-06-08");
    const length = (new DateDiff(end_date, start_date)).days() + 1;
    const individual_tiers = [10000, 12500, 15000];

    return {
      average_steps: Math.round(time_series_responses.reduce((accumulator, time_series_response) => {
        return accumulator + time_series_response.time_series['activities-steps'].reduce((accumulator, data) => {
          return accumulator + parseInt(data.value);
        }, 0);
      }, 0) / competition_length),
      days_in: competition_length,
      end_date: format_date(end_date),
      individual_tiers: individual_tiers,
      length: length,
      start_date: format_date(start_date),
      total_steps: time_series_responses.reduce((accumulator, time_series_response) => {
        return accumulator + time_series_response.time_series['activities-steps'].reduce((accumulator, data) => {
          return accumulator + parseInt(data.value);
        }, 0);
      }, 0),
      total_tiers: individual_tiers.map(tier => tier * length),
      users: users,
      yesterdays_steps: time_series_responses.reduce((accumulator, time_series_response) => {
        return accumulator + parseInt(time_series_response.time_series['activities-steps'].pop().value);
      }, 0),
    };
  },
};

export { competitionQueryResolvers }
