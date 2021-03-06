const getFirstName = fullName => {
  const arrayOfString = fullName.split(' ');
  return arrayOfString[0];
};

const isValidPassword = password => {
  return password.length >= 8 && !password.toLowerCase().includes('password');
};

export { getFirstName, isValidPassword };
