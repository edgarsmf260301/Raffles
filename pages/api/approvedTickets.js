import clientPromise from '../../lib/db';
import { authMiddleware } from './authMiddleware';

const handler = async (req, res) => {
  const client = await clientPromise;
  const db = client.db('raffles');

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const approvedTickets = await db.collection('tickets').find({ status: 'Aprobado' }).toArray();
        res.status(200).json({ success: true, data: approvedTickets });
      } catch (error) {
        console.error('Failed to fetch approved tickets:', error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
};

export default authMiddleware(handler);