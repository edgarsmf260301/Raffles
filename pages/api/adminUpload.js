import { upload } from './upload/cloudinaryConfig';
import clientPromise from '../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al subir el archivo', error: err.message });
      }

      try {
        const { ticket, customerName, customerId, customerPhone, customerState, prize } = req.body;
        const image = req.file ? req.file.path : null;

        // Validar que todos los campos requeridos estén presentes
        if (!ticket || !customerName || !customerId || !customerPhone || !customerState || !prize || !image) {
          return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Conectar a la base de datos
        const client = await clientPromise;
        const db = client.db('raffles');

        // Crear un nuevo ganador
        const newWinner = {
          ticket,
          customerName,
          customerId,
          customerPhone,
          customerState,
          prize,
          image,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Guardar el ganador en la base de datos
        await db.collection('winners').insertOne(newWinner);

        res.status(201).json({
          message: 'Ganador registrado exitosamente',
          data: newWinner,
        });
      } catch (error) {
        console.error('Error al registrar el ganador:', error);
        res.status(500).json({ message: 'Error al registrar el ganador', error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}