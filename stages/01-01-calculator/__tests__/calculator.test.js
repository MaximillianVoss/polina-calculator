import { calculateValues, formatNumber, parseNumberInput } from '../src/calculator';

describe('calculator logic', () => {
  test.each([
    ['12', 12],
    ['-3.5', -3.5],
    ['2,75', 2.75],
  ])('parseNumberInput(%p) returns %p', (text, value) => {
    expect(parseNumberInput(text)).toEqual({ ok: true, value });
  });

  test.each(['', '   ', 'abc', 'Infinity', '0x10', '1e2', '--2', '2.3.4'])(
    'parseNumberInput rejects %p',
    (text) => {
      expect(parseNumberInput(text)).toEqual({
        ok: false,
        error: 'Enter a valid number.',
      });
    },
  );

  test('calculateValues adds decimal-comma values and formats the result', () => {
    expect(calculateValues('2,5', '1.25', '+')).toEqual({
      ok: true,
      value: 3.75,
    });
    expect(formatNumber(3.75)).toBe('3.75');
  });

  test('calculateValues subtracts and does not convert invalid input to NaN', () => {
    expect(calculateValues('23', '12', '-')).toEqual({ ok: true, value: 11 });
    expect(calculateValues('23', '', '-')).toEqual({
      ok: false,
      error: 'Enter a valid number.',
    });
  });

  test('calculateValues rejects a non-finite result caused by overflow', () => {
    const hugeDecimal = '9'.repeat(308);
    expect(calculateValues(hugeDecimal, hugeDecimal, '+')).toEqual({
      ok: false,
      error: 'Result is too large.',
    });
  });

  test.each([
    [0.1 + 0.2, '0.3'],
    [5, '5'],
    [3.75, '3.75'],
  ])('formatNumber(%p) returns %p', (value, expected) => {
    expect(formatNumber(value)).toBe(expected);
  });
});
