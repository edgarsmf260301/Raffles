const express = require('express');
const cors = require('cors'); // Importar cors
const { upload } = require('./cloudinaryConfig'); // Ruta relativa a cloudinaryConfig.js

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para permitir solicitudes desde http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Ruta para manejar la carga de archivos
app.post('/api/upload', (req, res) => {
  try {
    upload.single('imgbuy')(req, res, (err) => {
      if (err) {
        console.error('Error during file upload:', err);
        return res.status(500).send('Error during file upload.');
      }
      if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).send('No file uploaded.');
      }
      console.log('File uploaded successfully:', req.file.path);
      res.status(200).json({ fileUrl: req.file.path });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Unexpected error occurred.');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});