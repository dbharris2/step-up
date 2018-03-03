const profileQueryResolvers = {
  profile: async (root, {user_id}, context) => {
    const response = await context.db.collection('fitbit_profiles').findOne({user_id});
    return {
      avatar: response.profile.user.avatar,
      displayName: response.profile.user.displayName,
      user_id: response.profile.user.encodedId,
    };
  },
};

const profileEdgeResolvers = {
  profile: async (root, {user_id}, context) => {
    const response = await context.db.collection('fitbit_profiles').findOne({
      user_id: root.user_id,
    });
    return {
      avatar: response.profile.user.avatar,
      displayName: response.profile.user.displayName,
      user_id: response.profile.user.encodedId,
    };
  },
}

export { profileEdgeResolvers, profileQueryResolvers };
