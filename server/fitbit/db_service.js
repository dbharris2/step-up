import FitbitApiClient from 'fitbit-node';

export default class DbService {

  constructor() {
    this.db = null;
  }

  async genUpdateOneUser(user) {
    await this.db.collection('users').replaceOne({
      user_id: user.user_id,
    }, {
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      user_id: user.user_id,
    }, {
      upsert: true,
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
