import DbService from './db_service';
import StepUpClient from './stepup_client';
import {
  getDateForYesterdaysSteps,
  getStartOfCompetition,
} from '../utils/date_helpers';

export default class StepUpService {

  constructor() {
    this.clients = [];
    this.db_service = new DbService();
  }

  async genAll(url) {
    console.log('gen: ' + url);
    const data_promises = this.clients.map(client => {
      return client.stepup_client.gen(
        url,
        client.user,
      );
    });

    try {
      const data_responses = await Promise.all(data_promises);
      const user_update_promises = data_responses.map(response => {
        return this.db_service.genReplaceUser(response.user);
      });
      await Promise.all(user_update_promises);
      return data_responses;
    } catch (e) {
      console.log(e.context.errors[0]);
      return {};
    }
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
      '/activities/steps/date/' + getStartOfCompetition() + '/' + getDateForYesterdaysSteps() + '.json'
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

  FORCIBLY_refreshAccessTokens() {
    console.log('Forcibly refresh access tokens for everyone');
    this.clients.map(async client => {
      console.log('Current refresh token: ' + client.user.refresh_token);
      const updated_user = await client.stepup_client.genRefreshAccessToken(client.user);
      if (updated_user === null) {
        console.log('Failed to refresh access token for user: ' + client.user.user_id);
      } else {
        this.db_service.genReplaceUser(client.user);
      }
    });
  }

  setDb(db) {
    this.db_service.setDb(db);
  }
}
