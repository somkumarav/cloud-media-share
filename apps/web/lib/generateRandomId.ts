const MAX_LENGHT = 5;

export const generateRandomId = () => {
  let res = "";
  const subSet = "1234567890qwertyuiopasdfghjklzxcvbnm";
  for (let i = 0; i < MAX_LENGHT; i++) {
    res += subSet[Math.floor(Math.random() * subSet.length)];
  }
  return res;
};
