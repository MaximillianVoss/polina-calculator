/** Разбирает текст поля; при пустом, нечисловом или бесконечном значении возвращает ошибку. */
export function parseNumberInput(text) {
  const trimmed = text.trim();
  const decimalPattern = /^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/;
  if (!decimalPattern.test(trimmed)) {
    return { ok: false, error: 'Enter a valid number.' };
  }

  const normalized = trimmed.replace(',', '.');
  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid number.' };
  }
  return { ok: true, value };
}

/** Выполняет сложение или вычитание только после успешной проверки обоих полей. */
export function calculateValues(firstText, secondText, operation) {
  const first = parseNumberInput(firstText);
  const second = parseNumberInput(secondText);
  if (!first.ok) return first;
  if (!second.ok) return second;
  const value = operation === '+' ? first.value + second.value : first.value - second.value;
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Result is outside the supported number range.' };
  }
  return { ok: true, value };
}

/** Возвращает понятную строку без лишнего нуля или простой двоичной погрешности. */
export function formatNumber(value) {
  return String(Number(value.toFixed(10)));
}

/** Создаёт готовую строку истории с ключом, не зависящим от текста выражения. */
export function createHistoryEntry(id, first, operation, second, result) {
  return {
    id,
    expression: `${formatNumber(first)} ${operation} ${formatNumber(second)} = ${formatNumber(result)}`,
  };
}

/** Возвращает стабильный ключ записи; одинаковый текст выражения на ключ не влияет. */
export function getHistoryEntryKey(entry) {
  return entry.id;
}

/** Возвращает новый массив, поэтому уже отображённая история не изменяется напрямую. */
export function appendHistory(history, entry) {
  return [...history, entry];
}
