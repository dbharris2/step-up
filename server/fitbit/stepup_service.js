import DbService from './db_service';
import StepUpClient from './stepup_client';

export default class StepUpService {

  constructor() {
    this.clients = [];
    this.db_service = new DbService();
  }

  async genAll(url) {
    const data_promises = this.clients.map(client => {
      return client.stepup_client.gen(
        url,
        client.user,
      );
    });
    const data_responses = await Promise.all(data_promises);

    const user_update_promises = data_responses.map(response => {
      return this.db_service.genReplaceUser(response.user);
    });
    await Promise.all(user_update_promises);

    return data_responses;
  }

  async genAllUserProfiles() {
    const responses = await this.genAll('/profile.json');
    const profile_promises = responses.map(async response =>
      this.genReplaceUserProfile(response.data[0])
    );
    await Promise.all(profile_promises);
  }

  async genAllUserTimeSeries() {
    const responses = await this.genAll(
      '/activities/steps/date/2017-04-20/2017-06-08.json'
    );
    const time_series_promises = responses.map(async response =>
      this.genReplaceUserTimeSeries(
        response.user.user_id,
        response.data[0],
      )
    );
    await Promise.all(time_series_promises);
  }

  async genCreateUser(code, callbackUrl) {
    const stepup_client = new StepUpClient(
      process.env.APP_ID,
      process.env.APP_SECRET,
    );
    const user = await stepup_client.genAccessToken(code, callbackUrl);
    await this.db_service.genReplaceUser(user);

    this.clients = this.clients.filter(client =>
      client.user.user_id !== user.user_id
    );
    this.clients.push({
      stepup_client: stepup_client,
      user: user,
    });
    console.log(this.clients.map(client => client.user.user_id));
  }

  async genFetchUsers() {
    const users = await this.db_service.genFetchUsers();
    this.clients = users.map(user => {
      return {
        stepup_client: new StepUpClient(
          process.env.APP_ID,
          process.env.APP_SECRET,
        ),
        user: user,
      };
    });
    console.log('Fetched users');
    console.log(this.clients.map(client => client.user.user_id));
  }

  async genReplaceUserTimeSeries(user_id, time_series) {
    return await this.db_service.genReplaceUserTimeSeries(user_id, time_series);
  }

  async genReplaceUserProfile(profile) {
    return await this.db_service.genReplaceUserProfile(profile);
  }

  setDb(db) {
    this.db_service.setDb(db);
  }
}
