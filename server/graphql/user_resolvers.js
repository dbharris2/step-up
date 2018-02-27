import {ObjectId} from 'mongodb'

const userQueryResolvers = {
  user: async (root, {_id}, context) => {
    return await context.db.collection('users').findOne(ObjectId(_id));
  },
  users: async (root, args, context) => {
    return await context.db.collection('users').find({}).toArray();
  },
};

export { userQueryResolvers }
