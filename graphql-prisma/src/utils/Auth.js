import jwt from 'jsonwebtoken';

const verifyToken = req => {
  const header = req.request.headers.authorization;
  if (!header) throw new Error('Authentication required');

  const token = header.replace('Bearer ', '');
  const decoded = jwt.verify(token, 'thisissecretcode');
  if (!decoded) throw new Error('You are not owner');

  return decoded.userId;
};

export { verifyToken as default };
