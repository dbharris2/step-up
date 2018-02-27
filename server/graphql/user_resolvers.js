import {ObjectId} from 'mongodb'

const userQueryResolvers = {
  user: async (root, {id}, context) => {
    return await context.db.collection('users').findOne(ObjectId(id));
  },
  users: async (root, args, context) => {
    return await context.db.collection('users').find({}).toArray();
  },
};

export { userQueryResolvers }
