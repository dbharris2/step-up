import FitbitApiClient from 'fitbit-node';

export default class StepUpClient {

  constructor(clientId, clientSecret) {
    this.client = new FitbitApiClient({
    	clientId: clientId,
    	clientSecret: clientSecret,
    	apiVersion: '1.2',
    });
  }

  async gen(url, user) {
    const data = await this.client.get(url, user.access_token);
    if (data[0].success === undefined) {
      return {
        user: user,
        data: data,
      };
    } else if (!data[0].success && data[0].errors[0].errorType === 'expired_token') {
      const updated_user = await this.client.refreshAccessToken(
        user.access_token,
        user.refresh_token,
        -1,
      );
      const updated_data = await this.client.get(url, updated_user.access_token);
      return {
        user: updated_user,
        data: updated_data,
      };
    } else {
      return {};
    }
  }

  async genAccessToken(code, callbackUrl) {
    return await this.client.getAccessToken(code, callbackUrl);
  }

  getAuthorizeUrl(scope, redirectUrl) {
    return this.client.getAuthorizeUrl(scope, redirectUrl);
  }
}
