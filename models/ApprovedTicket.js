import mongoose from 'mongoose';

const ApprovedTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pendiente', 'Aprobado', 'Rechazado'],
  },
}, { timestamps: true });

export default mongoose.models.ApprovedTicket || mongoose.model('ApprovedTicket', ApprovedTicketSchema);