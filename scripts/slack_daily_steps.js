import axios from 'axios';

const { createApolloFetch } = require('apollo-fetch');

const GraphQL = createApolloFetch({
  uri: process.env.GRAPHQL_URL,
});

const start = async () => {
  const response = await GraphQL({
    query:`
      query Users {
        users {
          profile {
            displayName
          }
          yesterdays_steps {
            date
            value
          }
        }
      }`,
  });

  const firstTierUsers = response.data.users.filter(user => {
    return user.yesterdays_steps.value >= 12000;
  });

  const secondTierUsers = response.data.users.filter(user => {
    return user.yesterdays_steps.value >= 11000 && user.yesterdays_steps.value < 12000;
  });

  const thirdTierUsers = response.data.users.filter(user => {
    return user.yesterdays_steps.value >= 10000 && user.yesterdays_steps.value < 11000;
  });

  const messages = user => user.profile.displayName + " " + user.yesterdays_steps.value;

  await axios.post(
    process.env.DAILY_STEPS_CHANNEL_URL,
    {
      "attachments": [
        {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "good",
          "pretext": "Yesterday's Steps\n Tier 1",
          "text": firstTierUsers.map(user => messages(user)).join("\n")
        },
  		  {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "warning",
          "pretext": "Tier 2",
          "text": secondTierUsers.map(user => messages(user)).join("\n")
        },
        {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "danger",
          "pretext": "Tier 3",
          "text": thirdTierUsers.map(user => messages(user)).join("\n")
        }
      ]
    }
  );
};

start();
