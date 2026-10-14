/**
 * Преобразует текст из TextInput в конечное число.
 * TextInput всегда возвращает строку, поэтому преобразование выполняется явно.
 *
 * @param {string} text Текст из поля ввода.
 * @returns {{ ok: true, value: number } | { ok: false, error: string }}
 *   Проверенное число либо объяснение ошибки.
 */
export function parseNumberInput(text) {
  const trimmed = text.trim();
  // Разрешаем только обычную десятичную запись, а не hex или exponent syntax.
  const decimalPattern = /^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/;

  if (!decimalPattern.test(trimmed)) {
    return { ok: false, error: 'Enter a valid number.' };
  }

  const value = Number(trimmed.replace(',', '.'));
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid number.' };
  }

  return { ok: true, value };
}

/**
 * Выполняет сложение или вычитание только после проверки обоих полей.
 *
 * @param {string} firstText Текст первого поля.
 * @param {string} secondText Текст второго поля.
 * @param {'+' | '-'} operation Выбранная операция.
 * @returns {{ ok: true, value: number } | { ok: false, error: string }}
 *   Конечный результат либо объяснение ошибки.
 */
export function calculateValues(firstText, secondText, operation) {
  const first = parseNumberInput(firstText);
  const second = parseNumberInput(secondText);

  if (!first.ok) {
    return first;
  }

  if (!second.ok) {
    return second;
  }

  const value =
    operation === '+'
      ? first.value + second.value
      : first.value - second.value;

  // Два конечных числа всё же могут переполнить допустимый диапазон JavaScript.
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Result is too large.' };
  }

  return { ok: true, value };
}

/**
 * Убирает незначащие нули и погрешность простых десятичных вычислений.
 *
 * @param {number} value Проверенный конечный результат.
 * @returns {string} Короткая строка для вывода пользователю.
 */
export function formatNumber(value) {
  return String(Number(value.toFixed(10)));
}
