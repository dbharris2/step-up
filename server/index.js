import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import {MongoClient} from 'mongodb';

const graphqlExpress = require('graphql-server-express').graphqlExpress
const graphiqlExpress = require('graphql-server-express').graphiqlExpress
const schema = require('./graphql/schema').schema

import StepUpClient from './fitbit/stepup_client';
import StepUpService from './fitbit/stepup_service';

const app = express();

app.set('port', process.env.PORT || 8080);
app.use(cors());

console.log('auth url: ' + process.env.FITBIT_AUTHORIZATION_CALLBACK_URL);

const stepup_service = new StepUpService();

app.get('/authenticate', async (req, res) => {
  console.log("Authenticate");
  const stepup_client = new StepUpClient(
    process.env.APP_ID,
    process.env.APP_SECRET,
  );
  const authorizeUrl = stepup_client.getAuthorizeUrl(
    'activity location profile settings sleep social',
    process.env.FITBIT_AUTHORIZATION_CALLBACK_URL,
  );
  res.redirect(authorizeUrl);
});

app.get('/fitbit-callback', async (req, res) => {
  await stepup_service.genCreateUser(
    req.query.code,
    process.env.FITBIT_AUTHORIZATION_CALLBACK_URL,
  );
  await stepup_service.genAllUserProfiles();
  await stepup_service.genAllUserTimeSeries();
  res.redirect('/');
});

app.get('/profiles', async (req, res) => {
  const profiles = await stepup_service.genAllData('/profile.json');
  res.send(profiles);
});

export const start = async () => {
  MongoClient.connect(process.env.MONGODB_URI, async (err, client) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    stepup_service.setDb(client.db('stepup'));
    await stepup_service.genFetchUsers();

    app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
    app.use('/', bodyParser.json(), graphqlExpress({
      schema,
      context: {
        db: client.db('stepup'),
      }
    }));
    app.listen(app.get('port'), async () => {
      console.log('Server started: http://localhost:' + app.get('port') + '/graphiql');
    });
  });
};

start();
