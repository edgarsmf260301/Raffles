import clientPromise from '../../lib/db';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('raffles');
    const tickets = await db.collection('tickets').find({ status: 'Disponible' }, { projection: { ticketNumber: 1 } }).toArray();
    res.status(200).json({ data: tickets });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};