import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import FitbitApiClient from 'fitbit-node';
import {MongoClient} from 'mongodb';

const graphqlExpress = require('graphql-server-express').graphqlExpress
const graphiqlExpress = require('graphql-server-express').graphiqlExpress
const schema = require('./graphql/schema').schema

const app = express();

app.set('port', process.env.PORT || 8080);
app.use(cors());

app.get('/authenticate', async (req, res) => {
  const client = new FitbitApiClient({
  	clientId: process.env.APP_ID,
  	clientSecret: process.env.APP_SECRET,
  	apiVersion: '1.2',
  });
  const authorizeUrl = client.getAuthorizeUrl(
    'activity heartrate location profile settings sleep social',
    process.env.FITBIT_AUTHORIZATION_CALLBACK_URL,
  );
  res.redirect(authorizeUrl);
});

app.get('/fitbit-callback', async (req, res) => {
  const client = new FitbitApiClient({
    clientId: process.env.APP_ID,
  	clientSecret: process.env.APP_SECRET,
  	apiVersion: '1.2',
  });
  const accessToken = await client.getAccessToken(
    req.query.code,
    process.env.FITBIT_AUTHORIZATION_CALLBACK_URL,
  );
  const profile = await client.get('/profile.json', accessToken.access_token);
  res.send(profile[0]);
});

export const start = async () => {
  await MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
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
