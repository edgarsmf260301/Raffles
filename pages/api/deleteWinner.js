import clientPromise from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'ID de ganador es requerido' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('raffles');

      await db.collection('winners').deleteOne({ _id: new ObjectId(id) });

      res.status(200).json({ message: 'Ganador eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el ganador:', error);
      res.status(500).json({ message: 'Error al eliminar el ganador', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}