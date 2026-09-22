const words = [
'Vanzari',
'Friendly',
'Funnel',
'Lansare',
'Automat',
'Client',
'Raport',
'Calendar'];

const symbols = ['!', '#', '$', '%', '&', '*', '?'];

/** Generează o sugestie de parolă puternică, ușor de citit */
export function suggestPassword() {
  const word = words[Math.floor(Math.random() * words.length)];
  const second = words[Math.floor(Math.random() * words.length)].toLowerCase();
  const number = Math.floor(Math.random() * 90) + 10;
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  return `${word}-${second}${number}${symbol}`;
}

/** Cât de puternică e parola: 0–3 */
export function passwordStrength(value: string) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}