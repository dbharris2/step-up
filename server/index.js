import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import {MongoClient} from 'mongodb';

const graphqlExpress = require('graphql-server-express').graphqlExpress
const graphiqlExpress = require('graphql-server-express').graphiqlExpress
const schema = require('./graphql/schema').schema

const app = express();

const MONGO_URL = 'mongodb://localhost:27017/fitbit';

app.set('port', process.env.PORT || 8080);
app.use(cors());

export const start = async () => {
  const db = await MongoClient.connect(MONGO_URL, (err, client) => {
    const db = client.db('fitbit');
    app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
    app.use('/', bodyParser.json(), graphqlExpress({
      schema,
      context: {
        db: db,
      }
    }));
    app.listen(app.get('port'), async () => {
      console.log('Server started: http://localhost:' + app.get('port') + '/graphiql');
    });
  });
};

start();
