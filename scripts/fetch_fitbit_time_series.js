import {MongoClient} from 'mongodb';

import StepUpClient from '../server/fitbit/stepup_client';
import StepUpService from '../server/fitbit/stepup_service';

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const start = async () => {
  await MongoClient.connect(process.env.MONGODB_URI, async (err, client) => {
    const stepup_service = new StepUpService();
    stepup_service.setDb(client.db('stepup'));
    await stepup_service.genFetchUsers();
    const responses = await stepup_service.genAll(
      '/activities/steps/date/2017-04-20/2017-05-05.json'
    );

    const time_series_promises = responses.map(async response =>
      stepup_service.genReplaceUserTimeSeries(
        response.user.user_id,
        response.data[0],
      )
    );
    await Promise.all(time_series_promises);

    await sleep(500);
    client.close();
    process.exit();
  });
};

start();
