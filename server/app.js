import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { MongoClient,  ServerApiVersion } from "mongodb";
import "dotenv/config";
import cors from "cors";
import { createHandler } from 'graphql-http/lib/use/http';
import schema from './schema/index.js';

import { getChannelMessages, getChannels, addToChat } from "./db.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const list = ['http://localhost:3001']
const CORS_OPTIONS = {
  cors: {
    origin: function (origin, callback) {
      if (list.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    // credentials: true,
    
  },
};

const server = createServer(app);
const io = new Server(server, CORS_OPTIONS);

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

const collections = await initializeDatabase()

const handler = createHandler({ schema, context: {collections} });

app.use(cors(CORS_OPTIONS));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.all('/graphql', (req, res) => {
  handler(req, res);
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", async (msg) => {
    const result = await addToChat(msg);
    io.emit(`message:${msg.channelID}`, {...msg});
  });

  socket.on("message-delete", async (messageID, channelID) => {
    io.emit(`message-delete:${channelID}`, messageID);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
