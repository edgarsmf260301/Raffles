import clientPromise from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('raffles');
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { status } = req.body;

    if (!status || !['Aprobado', 'Anulado'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    try {
      await db.collection('customers').updateOne(
        { _id: ObjectId(id) },
        { $set: { status } }
      );
      res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
      console.error('Error actualizando el estado del cliente:', error);
      res.status(500).json({ message: 'Error actualizando el estado del cliente' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}