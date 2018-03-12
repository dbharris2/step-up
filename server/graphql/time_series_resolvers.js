const timeSeriesQueryResolvers = {
  average_steps: async (root, {user_id}, context) => {
    const response = await context.db.collection('fitbit_time_series').findOne({
      user_id,
    });
    return Math.round(response.time_series['activities-steps'].reduce(
      (accumulator, entry) => accumulator + parseInt(entry.value),
      0,
    ) / response.time_series['activities-steps'].length);
  },
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
  total_steps: async (root, {user_id}, context) => {
    const response = await context.db.collection('fitbit_time_series').findOne({
      user_id,
    });
    return response.time_series['activities-steps'].reduce(
      (accumulator, entry) => accumulator + parseInt(entry.value),
      0,
    );
  },
  yesterdays_steps: async (root, {user_id}, context) => {
    const response = await context.db.collection('fitbit_time_series').findOne({
      user_id,
    });
    return response.time_series['activities-steps'].pop().value;
  },
};

const timeSeriesEdgeResolvers = {
  average_steps: async (root, {}, context) => {
    const response = await context.db.collection('fitbit_time_series').findOne({
      user_id: root.user_id,
    });
    return Math.round(response.time_series['activities-steps'].reduce(
      (accumulator, entry) => accumulator + parseInt(entry.value),
      0,
    ) / response.time_series['activities-steps'].length);
  },
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
  total_steps: async (root, {}, context) => {
    const response = await context.db.collection('fitbit_time_series').findOne({
      user_id: root.user_id,
    });
    return response.time_series['activities-steps'].reduce(
      (accumulator, entry) => accumulator + parseInt(entry.value),
      0,
    );
  },
  yesterdays_steps: async (root, {}, context) => {
    const response = await context.db.collection('fitbit_time_series').findOne({
      user_id: root.user_id,
    });
    return response.time_series['activities-steps'].pop().value;
  },
}

export { timeSeriesEdgeResolvers, timeSeriesQueryResolvers }
