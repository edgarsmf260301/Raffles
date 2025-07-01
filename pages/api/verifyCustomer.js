import clientPromise from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { cedula, status } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db('raffles'); // Conectar a la base de datos 'raffles'
    const customers = await db
      .collection('customers') // Consultar la colección 'customers'
      .find({ id: cedula, status: status })
      .toArray();

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}