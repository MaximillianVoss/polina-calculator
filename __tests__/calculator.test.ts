import { calculate, formatNumber, parseNumberInput, type Operation } from '../src/calculator';

test.each<[string, number]>([
  ['12', 12],
  ['-3.5', -3.5],
  ['2,75', 2.75],
])('parseNumberInput(%p) accepts a finite number', (text, value) => {
  expect(parseNumberInput(text)).toEqual({ ok: true, value });
});

test.each(['', '  ', 'word', 'Infinity'])('parseNumberInput(%p) rejects invalid text', (text) => {
  expect(parseNumberInput(text)).toEqual({ ok: false, error: 'Enter a valid number.' });
});

test('calculate returns an expression for successful addition and subtraction', () => {
  expect(calculate('2,5', '1.25', '+')).toEqual({
    ok: true,
    value: 3.75,
    expression: '2.5 + 1.25 = 3.75',
  });
  expect(calculate('23', '12', '-')).toEqual({
    ok: true,
    value: 11,
    expression: '23 - 12 = 11',
  });
  expect(formatNumber(3.75)).toBe('3.75');
});

test.each<[string, string, Operation]>([
  ['1e308', '1e308', '+'],
  ['-1e308', '1e308', '-'],
])('calculate rejects a non-finite arithmetic result for %s %s %s', (first, second, operation) => {
  expect(calculate(first, second, operation)).toEqual({
    ok: false,
    error: 'The result is not a finite number.',
  });
});
