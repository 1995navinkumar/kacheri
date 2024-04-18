export function uuid(): string {
  // Generate a random number between 1000 and 9999 (inclusive)
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return randomNum.toString();
}

// Storage Utils
export function getItem(key: string, fallbackValue: string): string {
  return localStorage.getItem(key) ?? fallbackValue;
}

export function setItem(key: string, value: string): void {
  localStorage.setItem(key, value);
}
