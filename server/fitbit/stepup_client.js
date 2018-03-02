import FitbitApiClient from 'fitbit-node';

function to(promise) {
   return promise.then(data => {
      return [null, data];
   })
   .catch(err => [err]);
}

export default class StepUpClient {

  constructor(clientId, clientSecret) {
    this.client = new FitbitApiClient({
    	clientId: clientId,
    	clientSecret: clientSecret,
    	apiVersion: '1.2',
    });
  }

  async gen(url, user) {
    const [error, data] = await to(this.client.get(url, user.access_token));
    console.log("Error: " + error);
    if (error !== null && error.errors[0].errorType === 'expired_token') {
      console.log('Expired token');
      const updated_user = await this.client.refreshAccessToken(
        user.access_token,
        user.refresh_token,
        -1,
      );
      console.log('Updated user: ' + updated_user.user_id);
      return {
        user: updated_user,
        data: data,
      };
    } else {
      return {
        user: user,
        data: data,
      };
    }
  }

  async genAccessToken(code, callbackUrl) {
    return await this.client.getAccessToken(code, callbackUrl);
  }

  getAuthorizeUrl(scope, redirectUrl) {
    return this.client.getAuthorizeUrl(scope, redirectUrl);
  }
}
