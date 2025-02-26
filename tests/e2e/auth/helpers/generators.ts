import { randomInt } from 'node:crypto';

export const getRandomTestEmail = () => {
  return `playwright-test-${String(randomInt(1000000, 9999999))}@zenathra.com`;
};

export const generateRandomPassword = () => {
  const length = randomInt(10, 16);
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = uppercase + lowercase + numbers + special;

  const requiredChars = [
    uppercase[randomInt(uppercase.length)],
    lowercase[randomInt(lowercase.length)],
    numbers[randomInt(numbers.length)],
    special[randomInt(special.length)],
  ];

  const remainingChars = Array.from(
    { length: length - requiredChars.length },
    () => allChars[randomInt(allChars.length)],
  );

  const chars = [...requiredChars, ...remainingChars];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
};
