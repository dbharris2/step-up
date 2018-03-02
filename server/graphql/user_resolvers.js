const userQueryResolvers = {
  user: async (root, {user_id}, context) => {
    return await context.db.collection('users').findOne({user_id});
  },
  users: async (root, args, context) => {
    return await context.db.collection('users').find({}).toArray();
  },
};

export { userQueryResolvers }
