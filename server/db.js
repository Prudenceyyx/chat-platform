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

export async function createMessageDocument(collection) {
  const studentDocument = {
    name: "John Smith",
    birthdate: new Date(2000, 11, 20),
    address: { street: "Pike Lane", city: "Los Angeles", state: "CA" },
  };

  await collection.insertOne(studentDocument);
}

export async function findStudentsByName(collection, name) {
  return collection.find({ name }).toArray();
}

export async function getChannels() {
  const db = client.db('chat');
    const collection = db.collection('channels');

  return collection.find({}).toArray();
}

export async function getChannelMessages(channelID) {
   const db = client.db('chat');
    const collection = db.collection('messages');

  return collection.find({channelID}).toArray();
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    console.log("Connecting to MongoDB Atlas cluster...");
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");
    // const db = client.db('chat');
    // const collection = db.collection('channel_chat_relations');
    // console.log('CREATE Student');
    // await createMessageDocument(collection);
    // console.log(await findStudentsByName(collection, 'John Smith'));
  } catch (error) {
    console.dir(error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    // console.log("Connection Closed");
  }
}

export default run;
