export type Operation = '+' | '-';

export type ParsedNumber =
  | { ok: true; value: number }
  | { ok: false; error: string };

export type CalculationResult =
  | { ok: true; value: number; expression: string }
  | { ok: false; error: string };

export function parseNumberInput(text: string): ParsedNumber {
  const normalized = text.trim().replace(',', '.');
  const value = Number(normalized);

  return normalized === '' || !Number.isFinite(value)
    ? { ok: false, error: 'Enter a valid number.' }
    : { ok: true, value };
}

export function formatNumber(value: number): string {
  return String(Number(value.toFixed(10)));
}

export function calculate(
  firstText: string,
  secondText: string,
  operation: Operation,
): CalculationResult {
  const first = parseNumberInput(firstText);
  const second = parseNumberInput(secondText);

  if (!first.ok) return first;
  if (!second.ok) return second;

  const value = operation === '+' ? first.value + second.value : first.value - second.value;
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'The result is not a finite number.' };
  }

  return {
    ok: true,
    value,
    expression: `${formatNumber(first.value)} ${operation} ${formatNumber(second.value)} = ${formatNumber(value)}`,
  };
}
