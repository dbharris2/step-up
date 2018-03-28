import axios from 'axios';
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
    console.log(user.user_id + ' gen: ' + url);
    const data = await this.client.get(url, user.access_token);
    const success = data[0].success;
    if (success === undefined || success === true) {
      return {
        user: user,
        data: data,
      };
    } else if (this.isAccessTokenExpired(data)) {
      const updated_user = await this.genRefreshAccessToken(user);
      const updated_data = await this.client.get(url, updated_user.access_token);
      return {
        user: updated_user,
        data: updated_data,
      };
    } else {
      console.log(e.context.errors[0]);
      await axios.post(process.env.DAILY_STEPS_CHANNEL_URL, {'text': e.context.errors[0]});
      return {};
    }
  }

  isAccessTokenExpired(data) {
    return data[0].errors[0].errorType === 'expired_token'
      ? data[0].errors[0].message.includes('Access token expired')
      : false;
  }

  async genRefreshAccessToken(user) {
    console.log('Refreshing access token for user: ' + user.user_id);
    try {
      return await this.client.refreshAccessToken(
        user.access_token,
        user.refresh_token,
        -1,
      );
    } catch (e) {
      console.log(e.context.errors[0]);
      await axios.post(process.env.DAILY_STEPS_CHANNEL_URL, {'text': e.context.errors[0]});
      return null;
    }
  }

  async genAccessToken(code, callbackUrl) {
    console.log('Gen Access token');
    return await this.client.getAccessToken(code, callbackUrl);
  }

  getAuthorizeUrl(scope, redirectUrl) {
    return this.client.getAuthorizeUrl(scope, redirectUrl);
  }
}
