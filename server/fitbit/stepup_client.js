import FitbitApiClient from 'fitbit-node';

export default class StepUpClient {

  constructor(clientId, clientSecret) {
    this.client = new FitbitApiClient({
    	clientId: clientId,
    	clientSecret: clientSecret,
    	apiVersion: '1.2',
    });
  }

  async gen(url, access_token) {
    return await this.client.get(url, access_token);
  }

  async genAccessToken(code, callbackUrl) {
    return await this.client.getAccessToken(code, callbackUrl);
  }

  getAuthorizeUrl(scope, redirectUrl) {
    return this.client.getAuthorizeUrl(scope, redirectUrl);
  }
}
