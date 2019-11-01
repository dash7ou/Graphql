import jwt from 'jsonwebtoken';

const generateJWT = userId => {
  const token = jwt.sign({ userId }, 'thisissecretcode', { expiresIn: '2 days' });
  return token;
};

export { generateJWT as default };
