import clientPromise from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('raffles');
    const { ticketIds } = req.body;

    if (!ticketIds) {
      return res.status(400).json({ error: 'ticketIds are required' });
    }

    // Convert ticketIds to ObjectId
    const objectIds = ticketIds.map(id => {
      try {
        return new ObjectId(id);
      } catch (e) {
        throw new Error(`Invalid ticket ID: ${id}`);
      }
    });

    const tickets = await db.collection('tickets').find({ _id: { $in: objectIds } }).toArray();

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'No tickets found' });
    }

    res.status(200).json({ data: tickets });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
};