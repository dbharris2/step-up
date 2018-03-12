const competitionQueryResolvers = {
  competition: async (root, {}, context) => {
    const users = await context.db.collection('users').find({}).toArray();
    const time_series_responses = await context.db.collection('fitbit_time_series').find({}).toArray();
    const competition_length = time_series_responses[0].time_series['activities-steps'].length;

    return {
      "average_steps": Math.round(time_series_responses.reduce((accumulator, time_series_response) => {
        return accumulator + time_series_response.time_series['activities-steps'].reduce((accumulator, data) => {
          return accumulator + parseInt(data.value);
        }, 0);
      }, 0) / competition_length),
      "total_steps": time_series_responses.reduce((accumulator, time_series_response) => {
        return accumulator + time_series_response.time_series['activities-steps'].reduce((accumulator, data) => {
          return accumulator + parseInt(data.value);
        }, 0);
      }, 0),
      "users": users,
      "yesterdays_steps": time_series_responses.reduce((accumulator, time_series_response) => {
        return accumulator + parseInt(time_series_response.time_series['activities-steps'].pop().value);
      }, 0),
    };
  },
};

export { competitionQueryResolvers }
