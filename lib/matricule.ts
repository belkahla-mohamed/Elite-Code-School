const MATRICULE_PREFIX = "ECS";

let counter = 0;

function padMonth(month: number): string {
  return String(month).padStart(2, "0");
}

function padSequence(seq: number): string {
  return String(seq).padStart(4, "0");
}

export function generateMatricule(date?: Date): string {
  const d = date ?? new Date();
  const year = d.getFullYear();
  const month = padMonth(d.getMonth() + 1);
  counter++;
  return `${MATRICULE_PREFIX}-${year}${month}-${padSequence(counter)}`;
}

export function isValidMatricule(value: string): boolean {
  return /^ECS-\d{6}-\d{4}$/.test(value);
}

export function parseMatricule(matricule: string): { prefix: string; yearMonth: string; sequence: string; year: number; month: number } | null {
  const match = matricule.match(/^(ECS)-(\d{6})-(\d{4})$/);
  if (!match) return null;
  const [, prefix, yearMonth, sequence] = match;
  const year = parseInt(yearMonth.slice(0, 4), 10);
  const month = parseInt(yearMonth.slice(4, 6), 10);
  return { prefix, yearMonth, sequence, year, month };
}
