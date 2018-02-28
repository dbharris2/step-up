import DbService from './db_service';
import StepUpClient from './stepup_client';

export default class StepUpService {

  constructor() {
    this.clients = [];
    this.db_service = new DbService();
  }

  async genAccessToken(code, callbackUrl) {
    const access_token = await stepup_client.genAccessToken(code, callbackUrl);
    const client = {
      access_token: access_token,
      stepup_client: new StepUpClient(
        process.env.APP_ID,
        process.env.APP_SECRET,
      ),
    };
    this.clients.push(client);
    this.db_service.replaceOneUser(client.access_token);
  }

  async genAccessTokens() {
    const access_tokens = await this.db_service.genAccessTokens();
    this.clients = access_tokens.map(access_token => {
      return {
        access_token: access_token,
        stepup_client: new StepUpClient(
          process.env.APP_ID,
          process.env.APP_SECRET,
        ),
      };
    });
  }

  async genAll(url) {
    const data_promises = this.clients.map(client => {
      return client.stepup_client.gen(
        url,
        client.access_token.access_token
      );
    });
    return await Promise.all(data_promises);
  }

  setDb(db) {
    this.db_service.setDb(db);
  }
}
