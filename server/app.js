import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";
import { createHandler } from 'graphql-http/lib/use/http';
import schema from './schema/index.js';

import { getChannelMessages, getChannels, addToChat } from "./db.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const handler = createHandler({ schema });

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

app.use(cors(CORS_OPTIONS));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/channels", async (req, res) => {
  // const channelID = req.channelID;
  // const messages = await getChannelMessages(channelID);
  // res.send({messages: messages, channelID: channelID})
  const channels = await getChannels();
  res.send({ data: channels });
});

app.get("/channel-messages", async (req, res) => {
  const {channelID} = req.query;
  const messages = await getChannelMessages(channelID);
  res.send({ data: messages });
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
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
