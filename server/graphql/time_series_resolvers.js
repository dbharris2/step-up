const timeSeriesQueryResolvers = {
  time_series: async (root, {user_id}, context) => {
    const response = await context.db.collection('fitbit_time_series').findOne({
      user_id,
    });
    return response.time_series['activities-steps'].map(data => {
      return {
        date: data.dateTime,
        user_id: response.user_id,
        value: data.value,
      };
    });
  },
  yesterdays_steps: async (root, {user_id}, context) => {
    const response = await context.db.collection('fitbit_time_series').findOne({
      user_id,
    });
    const data = response.time_series['activities-steps'].pop();
    return {
      date: data.dateTime,
      user_id: response.user_id,
      value: data.value,
    };
  },
};

const timeSeriesEdgeResolvers = {
  time_series: async (root, {}, context) => {
    const response = await context.db.collection('fitbit_time_series').findOne({
      user_id: root.user_id,
    });
    return response.time_series['activities-steps'].map(data => {
      return {
        date: data.dateTime,
        user_id: response.user_id,
        value: data.value,
      };
    });
  },
  yesterdays_steps: async (root, {}, context) => {
    const response = await context.db.collection('fitbit_time_series').findOne({
      user_id: root.user_id,
    });
    const data = response.time_series['activities-steps'].pop();
    return {
      date: data.dateTime,
      user_id: response.user_id,
      value: data.value,
    };
  },
}

export { timeSeriesEdgeResolvers, timeSeriesQueryResolvers }
