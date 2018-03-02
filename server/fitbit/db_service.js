import FitbitApiClient from 'fitbit-node';

export default class DbService {

  constructor() {
    this.db = null;
  }

  async genReplaceUserTimeSeries(user_id, time_series) {
    console.log(user_id);
    console.log(time_series);
    return await this.db.collection('fitbit_time_series').replaceOne({
      user_id: user_id,
    }, {
      time_series: time_series,
      user_id: user_id,
    }, {
      upsert: true,
    }, (err, doc) => {
      if (err) {
        console.log(err);
      }
    });
  }

  async genReplaceUserProfile(profile) {
    return await this.db.collection('fitbit_profiles').replaceOne({
      user_id: profile.user.encodedId,
    }, {
      profile: profile,
      user_id: profile.user.encodedId,
    }, {
      upsert: true,
    }, (err, doc) => {
      if (err) {
        console.log(err);
      }
    });
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
