export function uuid() {
  // Generate a random number between 1000 and 9999 (inclusive)
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return randomNum.toString();
}
