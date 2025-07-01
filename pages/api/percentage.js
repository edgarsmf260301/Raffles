import clientPromise from '../../lib/db';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('raffles');
    const totalTickets = 9999;
    const soldTickets = await db.collection('tickets').countDocuments({ status: { $ne: 'Disponible' } });
    const percentage = (soldTickets / totalTickets) * 100;
    res.status(200).json({ percentage });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};