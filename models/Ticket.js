import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  number: Number,
  status: { type: String, default: 'Disponible' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);