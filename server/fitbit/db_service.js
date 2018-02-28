import FitbitApiClient from 'fitbit-node';

export default class DbService {

  constructor() {
    this.db = null;
  }

  replaceOneUser(access_token) {
    this.db.collection('users').replaceOne({
      user_id: access_token.user_id,
    }, {
      access_token: access_token.access_token,
      refresh_token: access_token.refresh_token,
      user_id: access_token.user_id,
    }, (err, doc) => {
      if (err) {
        console.log(err);
      }
    });
  }

  setDb(db) {
    this.db = db;
  }
}
