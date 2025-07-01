require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_UPLOAD_PRESET) {
  throw new Error('Missing Cloudinary configuration in .env');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rifasam',
    format: async (req, file) => 'png', // Puedes cambiar el formato si lo deseas
    public_id: (req, file) => file.originalname,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET, // Usar el preset de carga
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };