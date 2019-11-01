import jwt from 'jsonwebtoken';
import request from 'graphql-request';

const verifyToken = (req, requireAuth = true) => {
  const header = req.request
    ? req.request.headers.authorization
    : req.connection.context.Authorization;

  if (header) {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'thisissecretcode');
    if (!decoded) throw new Error('You are not owner');

    return decoded.userId;
  }
  if (requireAuth) throw new Error('Authentication required');
  return null;
};

export { verifyToken as default };
