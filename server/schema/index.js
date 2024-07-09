import {
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from "graphql";
import { timeDifference } from "../utils/index.js";
import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGDB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function initializeDatabase() {
  await client.connect();
  const db = client.db("chat");

  return {
    channelsCollection: db.collection("channels"),
    messagesCollection: db.collection("messages"),

  };
}

// Initialize the database when your application starts
// const { todosCollection } = initializeDatabase().then(collections => {
//   // Export or use the collections as needed
// });

const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: {
    id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
  },
});

const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (source) => source._id,
    },
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    content: {
      type: GraphQLString,
    },
    sender: {
      type: GraphQLString,
    },
    channelID: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (source) => timeDifference(new Date(), source.createdAt),
    },
  },
});

const ChannelType = new GraphQLObjectType({
  name: "Channel",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (source) => source._id,
    },
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    messages: {
      type: new GraphQLList(MessageType),
      args: {
        channelID: { type: GraphQLString },
      },
      resolve: async (root, args={}, context) => {
        const { messagesCollection } = await initializeDatabase();
        const result = await messagesCollection.find(args).toArray();
        return result;
      },

    },
    channels: {
      type: new GraphQLList(ChannelType),
      resolve: async (root, args, context) => {
        const { channelsCollection } = await initializeDatabase();
        const result = await channelsCollection.find({}).toArray();
        return result;
      },
    },
    todos: {
      type: new GraphQLList(TodoType),
      resolve: (root, args, context) => {
        return [
          { id: "1", title: "First todo" },
          { id: "2", title: "Second todo" },
        ];
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

export default schema;
