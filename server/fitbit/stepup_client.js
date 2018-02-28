import FitbitApiClient from 'fitbit-node';

export default class StepUpClient {

  constructor(clientId, clientSecret) {
    this.accessToken = null;
    this.client = new FitbitApiClient({
    	clientId: clientId,
    	clientSecret: clientSecret,
    	apiVersion: '1.2',
    });;
    this.db = null;
  }

  async gen(url) {
    return await this.client.get(
      url,
      this.accessToken.access_token,
    );
  }

  async genAccessToken(code, callbackUrl) {
    this.accessToken = await this.client.getAccessToken(code, callbackUrl);
  }

  getAuthorizeUrl(scope, redirectUrl) {
    return this.client.getAuthorizeUrl(scope, redirectUrl);
  }

  setDatabase(db) {
    this.db = db;
  }
}
