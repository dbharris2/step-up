import FitbitApiClient from 'fitbit-node';

export default class DbService {

  constructor() {
    this.db = null;
  }

  async genReplaceUserTimeSeries(user_id, time_series) {
    console.log(user_id);
    console.log(time_series);
    await this.db.collection('fitbit_time_series').update({
      "user_id": user_id,
    },
    { $set: { "time_series": time_series, "user_id": user_id, }},
    { upsert: true});
  }

  async genReplaceUserProfile(profile) {
    await this.db.collection('fitbit_profiles').update({
      "user_id": profile.user.encodedId,
    },
    { $set: { "profile": profile, "user_id": profile.user.encodedId, }},
    { upsert: true});
  }

  async genReplaceUser(user) {
    console.log('genReplaceUser: ' + user.user_id);
    await this.db.collection('users').update({
      "user_id": user.user_id,
    },
    { $set: {
      "access_token": user.access_token,
      "refresh_token": user.refresh_token,
      "user_id": user.user_id,
    }},
    { upsert: true});
  }

  async genFetchUsers() {
    return await this.db.collection('users').find({}).toArray();
  }

  setDb(db) {
    this.db = db;
  }
}
