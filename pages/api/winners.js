import clientPromise from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('raffles');

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const winners = await db.collection('winners').find({}).toArray();
        res.status(200).json({ success: true, data: winners });
      } catch (error) {
        console.error('Failed to fetch winners:', error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const { name, prize, ticket, customer, image } = req.body;
        if (!name || !prize || !ticket || !customer) {
          return res.status(400).json({ success: false, error: 'Name, prize, ticket, and customer are required' });
        }

        const winner = await db.collection('winners').insertOne({ name, prize, ticket, customer, image });
        res.status(201).json({ success: true, data: winner.ops[0] });
      } catch (error) {
        console.error('Failed to create winner:', error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}