import clientPromise from '../../lib/db';
import { ObjectId } from 'mongodb';
import { authMiddleware } from './authMiddleware';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('raffles');

      const winners = await db.collection('winners').find().toArray();
      const ticketIds = winners.map(winner => new ObjectId(winner.ticket));
      const tickets = await db.collection('tickets').find({ _id: { $in: ticketIds } }).toArray();
      const ticketMap = tickets.reduce((acc, ticket) => {
        acc[ticket._id.toString()] = ticket.ticketNumber;
        return acc;
      }, {});

      const winnersWithTicketNumbers = winners.map(winner => ({
        ...winner,
        ticket: ticketMap[winner.ticket] || winner.ticket,
      }));

      res.status(200).json({ data: winnersWithTicketNumbers });
    } catch (error) {
      console.error('Error al obtener los ganadores:', error);
      res.status(500).json({ message: 'Error al obtener los ganadores', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
};

export default authMiddleware(handler);