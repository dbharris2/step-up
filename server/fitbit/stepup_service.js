import DbService from './db_service';
import StepUpClient from './stepup_client';

export default class StepUpService {

  constructor() {
    this.clients = [];
    this.db_service = new DbService();
  }

  addClient(client) {
    this.clients.push(client);
    this.db_service.replaceOneUser(client.access_token);
  }

  async genAll(url) {
    const data_promises = this.clients.map(client => {
        return client.stepup_client.gen(
          url,
          client.access_token.access_token
        );
      },
    );
    return await Promise.all(data_promises);
  }

  setDb(db) {
    this.db_service.setDb(db);
  }
}
