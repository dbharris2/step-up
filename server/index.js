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

const stepup_service = new StepUpService();

app.get('/authenticate', async (req, res) => {
  const stepup_client = new StepUpClient(
    process.env.APP_ID,
    process.env.APP_SECRET,
  );
  const authorizeUrl = stepup_client.getAuthorizeUrl(
    'activity heartrate location profile settings sleep social',
    process.env.FITBIT_AUTHORIZATION_CALLBACK_URL,
  );
  res.redirect(authorizeUrl);
});

app.get('/fitbit-callback', async (req, res) => {
  const stepup_client = new StepUpClient(
    process.env.APP_ID,
    process.env.APP_SECRET,
  );
  const access_token = await stepup_client.genAccessToken(
    req.query.code,
    process.env.FITBIT_AUTHORIZATION_CALLBACK_URL,
  );
  stepup_service.addClient({
    access_token: access_token,
    stepup_client: stepup_client,
  });
  const profiles = await stepup_service.genAll('/profile.json');
  res.send(profiles.map(profile => profile[0]));
});

export const start = async () => {
  await MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
    stepup_service.setDb(client.db('stepup'));

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
