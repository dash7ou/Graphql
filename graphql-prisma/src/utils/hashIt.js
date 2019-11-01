import bcrypt from 'bcryptjs';

const hashIt = async password => {
  const passwordHashing = await bcrypt.hash(password, 10);
  return passwordHashing;
};

export { hashIt as default };
