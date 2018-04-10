import axios from 'axios';

const { createApolloFetch } = require('apollo-fetch');

const GraphQL = createApolloFetch({
  uri: process.env.GRAPHQL_URL,
});

const start = async () => {
  const response = await GraphQL({
    query:`
      query SlackbotAverageSteps {
        competition {
          average_steps
          individual_tiers
          users {
            average_steps
            profile {
              displayName
            }
          }
        }
      }`,
  });

  response.data.competition.users.sort((a, b) => {
    if (a.average_steps < b.average_steps) {
      return 1;
    } else if (a.average_steps > b.average_steps) {
      return -1;
    } else {
      return 0;
    }
  });

  const users_with_tiers = response.data.competition.users.map(user => {
    let current_tier = 0;
    response.data.competition.individual_tiers.forEach(tier => {
      if (user.average_steps >= tier) {
        current_tier = tier;
      }
    });
    return {
      average_steps: user.average_steps,
      name: user.profile.displayName,
      tier: current_tier,
    };
  });

  const firstTierUsers = users_with_tiers.filter(user => {
    return user.average_steps >= response.data.competition.individual_tiers[2];
  });

  const secondTierUsers = users_with_tiers.filter(user => {
    return user.average_steps >= response.data.competition.individual_tiers[1] && user.average_steps < response.data.competition.individual_tiers[2];
  });

  const thirdTierUsers = users_with_tiers.filter(user => {
    return user.average_steps >= response.data.competition.individual_tiers[0] && user.average_steps < response.data.competition.individual_tiers[1];
  });

  const fourthTierUsers = users_with_tiers.filter(user => {
    return user.average_steps < response.data.competition.individual_tiers[0];
  });

  const messages = user => user.name + " " + user.average_steps;

  await axios.post(
    process.env.DAILY_STEPS_CHANNEL_URL,
    {
      "attachments": [
        {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "#7E1DFF",
          "pretext": "Average Steps\n Tier 1 - <3 Pizza Parties <3",
          "text": firstTierUsers.map(user => messages(user)).join("\n")
        },
  		  {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "#01D59A",
          "pretext": "Tier 2 - Solid, But Pizza...",
          "text": secondTierUsers.map(user => messages(user)).join("\n")
        },
        {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "#FCA53A",
          "pretext": "Tier 3 - Pizza Party Haters Club",
          "text": thirdTierUsers.map(user => messages(user)).join("\n")
        },
        fourthTierUsers.length > 0 ?
        {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "#EB3B49",
          "pretext": "Tier 4 - The Unamazing Racers Who Hate Pizza",
          "text": fourthTierUsers.map(user => messages(user)).join("\n")
        } : null,
      ]
    }
  );
};

start();
