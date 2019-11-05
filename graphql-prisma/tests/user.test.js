import { getFirstName, isValidPassword } from '../src/utils/user';

test('Should return first name when given full name', () => {
  const firstName = getFirstName('Mohammed M R Zourob');
  expect(firstName).toBe('Mohammed');
});

test('Should return first name when given first name', () => {
  const firstName = getFirstName('Mohammed');
  expect(firstName).toBe('Mohammed');
});

test('should reject password shorter than 8 character', () => {
  const isValid = isValidPassword('abc1234');
  expect(isValid).toBe(false);
});

test('should reject password contains word password', () => {
  const isValid = isValidPassword('password12345');
  expect(isValid).toBe(false);
});

test('should correctly validate a valid password', () => {
  const isValid = isValidPassword('mohammed2344');
  expect(isValid).toBe(true);
});
