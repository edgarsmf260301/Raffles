import { authMiddleware } from './authMiddleware';

const handler = async (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin panel' });
};

export default authMiddleware(handler);