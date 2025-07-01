import clientPromise from '../../lib/db';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('raffles');

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (req.method === 'GET') {
      const { status } = req.query;
      const customers = await db.collection('customers').find({ status }).toArray();
      res.status(200).json(customers);
    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const { status, fromAdminA, fromAdminR } = req.body;

      // Fetch the customer to get the selected tickets
      const customer = await db.collection('customers').findOne({ _id: new ObjectId(id) });
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      const ticketIds = customer.selectedTickets.map(ticketId => new ObjectId(ticketId));

      if (status === 'Aprobado') {
        // Validate the tickets before updating their status to "Aprobado"
        const tickets = await db.collection('tickets').find({ _id: { $in: ticketIds } }).toArray();
        const unavailableTickets = tickets.filter(ticket => ticket.status !== 'Disponible').map(ticket => ticket.ticketNumber);

        if (unavailableTickets.length > 0) {
          return res.status(400).json({ message: `Lo lamento pero los tickets seleccionados, ${unavailableTickets.join(', ')}, ya fueron asignados a otro cliente` });
        }

        // Update the status of the tickets to "Aprobado"
        await db.collection('tickets').updateMany(
          { _id: { $in: ticketIds } },
          { $set: { status: 'Aprobado' } }
        );
      } else if (status === 'Rechazado' && fromAdminA) {
        // Validate the tickets before updating their status to "Disponible"
        const tickets = await db.collection('tickets').find({ _id: { $in: ticketIds } }).toArray();
        const unavailableTickets = tickets.filter(ticket => ticket.status !== 'Aprobado').map(ticket => ticket.ticketNumber);

        if (unavailableTickets.length > 0) {
          return res.status(400).json({ message: `Lo lamento pero los tickets seleccionados, ${unavailableTickets.join(', ')}, no están en estado "Aprobado"` });
        }

        // Update the status of the tickets to "Disponible"
        await db.collection('tickets').updateMany(
          { _id: { $in: ticketIds } },
          { $set: { status: 'Disponible' } }
        );
      } else if (status === 'Cancelado' && fromAdminR) {
        // Delete the customer document
        await db.collection('customers').deleteOne({ _id: new ObjectId(id) });

        // Update the status of the tickets to "Disponible"
        await db.collection('tickets').updateMany(
          { _id: { $in: ticketIds } },
          { $set: { status: 'Disponible' } }
        );

        return res.status(200).json({ success: true });
      }

      // Update customer status
      const result = await db.collection('customers').updateOne({ _id: new ObjectId(id) }, { $set: { status } });

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Customer not found or status not updated' });
      }

      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}