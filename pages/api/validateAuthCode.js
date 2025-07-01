import jwt from 'jsonwebtoken';

export default async (req, res) => {
  const { token, authCode } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.authCode === authCode) {
      const newToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200).json({ success: true, token: newToken });
    } else {
      res.status(401).json({ success: false, message: 'Invalid authorization code' });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};