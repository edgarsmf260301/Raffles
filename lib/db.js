import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export const getPosts = async () => {
  try {
    const client = await clientPromise;
    const db = client.db('raffles');

    const customers = await db.collection('customers').find({}).toArray();
    const tickets = await db.collection('tickets').find({}).toArray();
    const winners = await db.collection('winners').find({}).toArray();

    const posts = [
      ...customers.map(customer => ({ id: customer._id, type: 'customer', ...customer })),
      ...tickets.map(ticket => ({ id: ticket._id, type: 'ticket', ...ticket })),
      ...winners.map(winner => ({ id: winner._id, type: 'winner', ...winner })),
    ];

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Error fetching posts');
  }
};