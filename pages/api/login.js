import clientPromise from '../../lib/db';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  const { username, password } = req.body;
  const client = await clientPromise;
  const db = client.db('raffles');

  try {
    const user = await db.collection('users').findOne({ username, password });

    if (user) {
      const authCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
      const token = jwt.sign(
        { userId: user._id, authCode },
        process.env.JWT_SECRET,
        { expiresIn: '2m' }
      );

      // Configurar nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Opciones del correo
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Your Authorization Code',
        text: `Your authorization code is ${authCode}. It will expire in 2 minutes.`,
      };

      // Enviar el correo
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Error sending email', error: error.message });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ success: true, token });
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};