import mongoose from 'mongoose';

const WinnerSchema = new mongoose.Schema({
  ticket: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerState: {
    type: String,
    required: true,
  },
  prize: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Almacenar la URL de la imagen
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Winner || mongoose.model('Winner', WinnerSchema);