# Calculator Pages

## Условие и результат

**Original:** build a calculator with separate calculator and history pages, Native Stack navigation and a shared calculation history.  
**Перевод:** создать калькулятор с отдельными экранами вычислений и истории, навигацией Native Stack и общей историей.

Приложение складывает и вычитает два числа, принимает десятичную запятую и сохраняет каждое успешное выражение только в памяти текущего запуска.

## Установка и запуск на macOS

Нужны Node.js не ниже 20.19.4 и npm. В каталоге проекта выполнить `npm ci`, `npm test -- --runInBand`, `npx expo-doctor`, `npx expo export --platform android`, затем `npx expo start`. Для Android открыть приложение через Expo Go или эмулятор.

## Структура и реализация

`App.tsx` регистрирует Native Stack; `src/CalculatorScreen.tsx` выполняет вычисления; `src/HistoryScreen.tsx` показывает `FlatList`; `src/history-context.tsx` хранит общую типизированную историю; `src/calculator.ts` содержит чистые функции; TypeScript-тесты в `__tests__` проверяют логику и пользовательский маршрут.

Контролируемые текстовые поля передают строки в `calculate`, поэтому пустой и нечисловой ввод безопасно отклоняется; отдельно отклоняется и арифметическое переполнение до `Infinity`. Результат объявляется как polite live region, а ошибка — как assertive alert. Context выбран вместо navigation params, чтобы история не терялась при переходах; новый элемент добавляется неизменяющим append, а `useRef` формирует стабильный ключ FlatList.

## Ручная проверка и защита

Проверить `23 + 12`, `23 - 12`, пустое поле, переход в History и возврат: две записи должны остаться. API-ключей и сетевых запросов здесь нет.

Вопрос преподавателя: «Почему Context?» Ответ: это единый state для обоих экранов, тогда как params передают снимок данных.  
Question: “Why FlatList?” Answer: it renders a variable list efficiently and uses stable item keys.

## Сдача

Перед сдачей повторить команды из раздела запуска и приложить ссылку на репозиторий вместе с краткой демонстрацией перехода в History.
