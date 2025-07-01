import clientPromise from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  const { method } = req;
  const { id } = req.body;

  if (method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const client = await clientPromise;
    const db = client.db('raffles'); // Conectar a la base de datos 'raffles'

    // Eliminar el cliente de la colección customers
    await db.collection('customers').deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};