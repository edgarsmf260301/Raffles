import clientPromise from '../../lib/db';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('raffles');

  const { method } = req;
  const { ticketId } = req.query;

  switch (method) {
    case 'GET':
      try {
        const customers = await db.collection('customers').find({ selectedTickets: ticketId }).toArray();
        res.status(200).json(customers);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}