import axios from 'axios';

const { createApolloFetch } = require('apollo-fetch');

const GraphQL = createApolloFetch({
  uri: process.env.GRAPHQL_URL,
});

const start = async () => {
  const response = await GraphQL({
    query:`
      query SlackbotStepsTo15K {
        competition {
          steps_to_15k_per_user
        }
      }`,
  });
  console.log(response);

  await axios.post(
    process.env.DAILY_STEPS_CHANNEL_URL,
    {
      "text": "Yo steppers! If you wanna win this thing, you each need to get " + response.data.competition.steps_to_15k_per_user + " steps everyday from now on! :eeveerun:"
    }
  );
};

start();
