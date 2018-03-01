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
        client.user.access_token
      );
    });
    return await Promise.all(data_promises);
  }

  async genCreateUser(code, callbackUrl) {
    const stepup_client = new StepUpClient(
      process.env.APP_ID,
      process.env.APP_SECRET,
    );
    const user = await stepup_client.genAccessToken(code, callbackUrl);
    await this.db_service.genUpdateOneUser(user);
    const client = {
      stepup_client: stepup_client,
      user: user,
    };
    this.clients.push(client);
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
  }

  setDb(db) {
    this.db_service.setDb(db);
  }
}
