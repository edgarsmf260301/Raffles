import { upload } from './upload/cloudinaryConfig';
import clientPromise from '../../lib/db';
import Customer from '../../models/Customer';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('imgbuy')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al subir el archivo', error: err.message });
      }

      try {
        const { id, name, phone, state, paymentMethod, selectedTickets, sendToWhatsApp, registerTime, totalPrice } = req.body;
        const imgBuy = req.file ? req.file.path : null;

        // Validar que todos los campos requeridos estén presentes
        if (!id || !name || !phone || !state || !paymentMethod || !selectedTickets) {
          return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Validar que selectedTickets esté definido y sea una cadena JSON válida
        let parsedTickets;
        try {
          parsedTickets = JSON.parse(selectedTickets);
        } catch (parseError) {
          return res.status(400).json({ message: 'selectedTickets no es una cadena JSON válida', error: parseError.message });
        }

        // Conectar a la base de datos
        const client = await clientPromise;
        const db = client.db('raffles');

        // Crear un nuevo cliente
        const newCustomer = new Customer({
          id,
          name,
          phone,
          state,
          paymentMethod,
          selectedTickets: parsedTickets,
          totalPrice: parseInt(totalPrice, 10),
          sendToWhatsApp: sendToWhatsApp === 'true',
          registerTime,
          status: 'Procesando',
          imgBuy // Añadir este campo
        });

        // Guardar el cliente en la base de datos
        await db.collection('customers').insertOne(newCustomer);

        res.status(201).json({
          message: 'Registro exitoso',
          data: newCustomer
        });
      } catch (error) {
        console.error('Error al registrar el cliente:', error);
        res.status(500).json({ message: 'Error al registrar el cliente', error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}