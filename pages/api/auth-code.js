import jwt from 'jsonwebtoken';

export default async (req, res) => {
  const { authCode, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.authCode === authCode) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid authorization code' });
    }
  } catch (error) {
    console.error('Authorization failed:', error);
    res.status(500).json({ message: 'Authorization failed', error: error.message });
  }
};