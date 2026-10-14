import {
  appendHistory,
  calculateValues,
  createHistoryEntry,
  formatNumber,
  getHistoryEntryKey,
  parseNumberInput,
} from '../src/calculator-history';

test('parses dot and comma decimals but rejects empty and non-finite input', () => {
  expect(parseNumberInput(' 2,5 ')).toEqual({ ok: true, value: 2.5 });
  expect(parseNumberInput('+12')).toEqual({ ok: true, value: 12 });
  expect(parseNumberInput('-.5')).toEqual({ ok: true, value: -0.5 });
  expect(parseNumberInput('')).toEqual({ ok: false, error: 'Enter a valid number.' });
  expect(parseNumberInput('Infinity')).toEqual({ ok: false, error: 'Enter a valid number.' });
});

test('rejects hexadecimal, exponent, and mixed numeric notation', () => {
  for (const text of ['0x10', '1e2', '-1E3', '1,2.3', '--2']) {
    expect(parseNumberInput(text)).toEqual({ ok: false, error: 'Enter a valid number.' });
  }
});

test('calculates addition and subtraction with literal results', () => {
  expect(calculateValues('23', '12', '+')).toEqual({ ok: true, value: 35 });
  expect(calculateValues('23', '12', '-')).toEqual({ ok: true, value: 11 });
  expect(calculateValues('2,5', '1.25', '+')).toEqual({ ok: true, value: 3.75 });
});

test('rejects a non-finite calculation result even when both inputs are finite', () => {
  const largeDecimal = '9'.repeat(308);
  expect(calculateValues(largeDecimal, largeDecimal, '+')).toEqual({
    ok: false,
    error: 'Result is outside the supported number range.',
  });
});

test('formats whole numbers and ordinary decimal results without binary noise', () => {
  expect(formatNumber(41)).toBe('41');
  expect(formatNumber(0.1 + 0.2)).toBe('0.3');
});

test('creates the required formatted history expression', () => {
  expect(createHistoryEntry('history-1', 36, '+', 5, 41)).toEqual({ id: 'history-1', expression: '36 + 5 = 41' });
  expect(createHistoryEntry('history-2', 78, '-', 69, 9)).toEqual({ id: 'history-2', expression: '78 - 69 = 9' });
});

test('keeps chronological order without mutating the previous history', () => {
  const first = createHistoryEntry('history-1', 36, '+', 5, 41);
  const second = createHistoryEntry('history-2', 69, '+', 25, 94);
  const before = [first];
  expect(appendHistory(before, second)).toEqual([first, second]);
  expect(before).toEqual([first]);
});

test('keeps duplicate expressions as separate entries with stable ids', () => {
  const first = createHistoryEntry('history-1', 36, '+', 5, 41);
  const second = createHistoryEntry('history-2', 36, '+', 5, 41);
  expect(appendHistory([first], second)).toEqual([first, second]);
  expect(getHistoryEntryKey(first)).toBe('history-1');
  expect(getHistoryEntryKey(second)).toBe('history-2');
  expect(getHistoryEntryKey(first)).not.toBe(getHistoryEntryKey(second));
});

test('does not produce a history candidate for invalid input', () => {
  expect(calculateValues('36', '', '+')).toEqual({ ok: false, error: 'Enter a valid number.' });
});
