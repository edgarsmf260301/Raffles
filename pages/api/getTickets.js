import clientPromise from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { ticketIds } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db('raffles'); // Conectar a la base de datos 'raffles'
    const objectIds = ticketIds.map(id => new ObjectId(id)); // Convertir los IDs a ObjectId
    const tickets = await db
      .collection('tickets') // Consultar la colección 'tickets'
      .find({ _id: { $in: objectIds } })
      .toArray();

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}