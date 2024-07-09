import {
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
} from "graphql";
import { timeDifference } from "../utils/index.js";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
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

const DeleteMessagePayload = new GraphQLObjectType({
  name: "DeleteMessagePayload",
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The ID of the deleted message",
    },
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Flag to indicate successful deletion",
    },
    message: {
      type: GraphQLString,
      description: "A message describing the result of the operation",
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
      resolve: async (root, args = {}, context) => {
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

const RootMutationType = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    deleteMessage: {
      type: DeleteMessagePayload,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, args = {}) => {
        // The logic to delete a message goes here
        // 'args.id' contains the message ID passed from the client
        console.log("deleteMessage", args);
        const { messagesCollection } = await initializeDatabase();
        const filter = { _id: new ObjectId(args._id) };
        const result = await messagesCollection.deleteOne(filter);
        console.log(result);

        return {
          _id: args._id,
          success: result.deletedCount > 0,
          message:
            result.deletedCount > 0
              ? "Message deleted successfully."
              : "Message not found.",
        };
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

export default schema;
