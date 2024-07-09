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
import { ObjectId } from "mongodb";
import "dotenv/config";

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
    quoteID: {
      type: GraphQLString,
    },
    quotedMessageContent: {
      type: GraphQLString,
      resolve: async (source, args, context) => {
        if (source.quoteID) {
          // Assuming 'getMessageById' is a function that retrieves a message by its ID
          // and 'context' has access to the necessary database methods
          // console.log(source.quoteID)
          const quotedMessage = await context.collections.messagesCollection.findOne({_id: new ObjectId(source.quoteID)});
          return quotedMessage ? quotedMessage.content : 'Quotation deleted';
        }
        return null; // or undefined, if there is no quoteID
      },
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
        const { messagesCollection } = context.collections;

        const result = await messagesCollection.find(args).toArray();
        return result;
      },
    },

    channels: {
      type: new GraphQLList(ChannelType),
      resolve: async (root, args, context) => {
        const { channelsCollection } = context.collections;

        const result = await channelsCollection.find({}).toArray();
        return result;
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
      resolve: async (_, args = {}, context) => {
        const { messagesCollection } = context.collections;

        const filter = { _id: new ObjectId(args._id) };
        const result = await messagesCollection.deleteOne(filter);

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
