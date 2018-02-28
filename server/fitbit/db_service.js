import FitbitApiClient from 'fitbit-node';

export default class DbService {

  constructor() {
    this.db = null;
  }

  async genInsertOneUser(access_token) {
    await this.db.collection('users').insertOne({
      access_token: access_token.access_token,
      refresh_token: access_token.refresh_token,
      user_id: access_token.user_id,
    }, (err, doc) => {
      if (err) {
        console.log(err);
      }
    });
  }

  async genFetchUsers() {
    return await this.db.collection('users').find({}).toArray();
  }

  setDb(db) {
    this.db = db;
  }
}
