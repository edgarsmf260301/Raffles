import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  state: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  selectedTickets: { type: [String], required: true },
  totalPrice: { type: Number, required: true },
  sendToWhatsApp: { type: Boolean, required: true },
  registerTime: { type: String, required: true },
  status: { type: String, required: true, default: 'Procesando' },
  imgBuy: { type: String } // Mantener este campo
});

const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

export default Customer;