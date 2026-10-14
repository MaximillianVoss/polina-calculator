# Компоненты интерфейса, hooks и API проекта

Этот справочник описывает только фактически используемые элементы текущего `App.js`. В нём строго разделены:

- **компоненты интерфейса** — `View`, `Text`, `TextInput`, `Button`, `FlatList` и `StatusBar`;
- **React hooks** — `useState` и `useRef`;
- **React Native API** — `StyleSheet` и его метод `create`;
- **JavaScript API и функции проекта** — `Number`, строковые методы и функции из `src/calculator-history.js`.

Hook и `StyleSheet` не являются контролами. Слово «контрол» ниже применяется только в широком учебном смысле к конкретному интерактивному или отображающему элементу экрана; технически корректный основной термин — «экземпляр компонента».

## 1. Терминология

| Термин | Значение в этом проекте | Пример |
|---|---|---|
| Компонент | Функция или тип React, из которого создаётся часть дерева интерфейса | `TextInput` |
| Экземпляр компонента | Конкретное использование компонента в JSX | Поле с `accessibilityLabel="First number"` |
| Prop | Входная настройка экземпляра компонента | `value={firstInput}` |
| Callback-prop | Функция, которую компонент вызывает в ответ на событие или при рендере элемента | `onChangeText={setFirstInput}`, `renderItem={({ item }) => ...}` |
| Событие | Действие пользователя или платформы, приводящее к callback | Изменение текста, нажатие кнопки |
| State | Данные компонента, обновление которых планирует новый рендер | `history` |
| Setter | Функция обновления, возвращённая `useState` | `setHistory` |
| Ref | Стабильный объект с изменяемым полем `current`, не запускающим рендер самостоятельно | `nextHistoryIdRef` |
| Управляемый ввод | Поле, чьё `value` берётся из state, а изменение записывается setter-функцией | Первый и второй `TextInput` |
| Рендер | Выполнение компонента и построение актуального JSX для текущих данных | Появление `FlatList` после первой записи |
| Условный рендер | Выбор одной из веток JSX | `history.length === 0 ? ... : ...` |
| API | Программный интерфейс, который не обязан создавать видимый элемент | `StyleSheet.create` |
| Доступное имя | Текст, по которому ассистивная технология сообщает назначение элемента | `First number` |
| `testID` | Технический идентификатор для тестов/автоматизации | `result-message` |
| Стабильный ключ | Строка, идентифицирующая элемент списка между рендерами | `history-2` |

## 2. Карта фактически используемых компонентов и API

Текущий импорт:

```js
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
```

### 2.1. Компоненты

| Компонент | Источник | Число экземпляров в текущем JSX | Фактическая роль |
|---|---|---:|---|
| `View` | `react-native` | 7 | Корневой фон, колонка экрана, две карточки, строка кнопок и две ячейки кнопок |
| `Text` | `react-native` | 9 | Заголовки, описание, подписи, ошибка, результат, пустое состояние и строка истории |
| `TextInput` | `react-native` | 2 | Управляемый ввод первого и второго числа |
| `Button` | `react-native` | 2 | Команды сложения и вычитания |
| `FlatList` | `react-native` | 1 условный | Виртуализированный вывод непустой истории |
| `StatusBar` | `expo-status-bar` | 1 | Тёмный стиль содержимого системной строки состояния |

### 2.2. Hooks и API, которые не являются компонентами/контролами

| Элемент | Категория | Число вызовов | Роль |
|---|---|---:|---|
| `useState` | React hook | 5 | Хранит два текста, результат, ошибку и массив истории |
| `useRef` | React hook | 1 | Хранит следующий id между рендерами |
| `StyleSheet.create` | React Native API | 1 | Создаёт именованный набор статических стилей |

`App` — пользовательский функциональный компонент проекта. `appendHistory`, `calculateValues`, `createHistoryEntry`, `formatNumber` и `getHistoryEntryKey` — импортированные функции предметной логики, а не UI-компоненты.

## 3. `View`: контейнер компоновки

### Категория

`View` — базовый компонент React Native для нативного контейнера и Flexbox-компоновки.

### Точный фрагмент текущего `App.js`

```jsx
<View style={styles.buttonRow}>
  <View style={styles.buttonCell}>
    {/* Стрелка передаёт обработчик события, а не запускает вычисление во время рендера. */}
    <Button title="+" onPress={() => handleCalculation('+')} color="#2563eb" />
  </View>
  <View style={styles.buttonCell}>
    <Button title="-" onPress={() => handleCalculation('-')} color="#2563eb" />
  </View>
</View>
```

Другие экземпляры используют `styles.safeArea`, `styles.screen`, `styles.card` и `styles.historyCard`.

### Props

| Prop в коде | Значение | Эффект |
|---|---|---|
| `style` | Ссылка вида `styles.buttonRow` | Применяет Flexbox, отступы, фон, рамку и размеры, определённые стилем |
| `children` | Вложенные компоненты между тегами | Формирует содержимое контейнера |

У `View` нет web-атрибута `className`; в этом коде передаётся объект стиля.

### События

Ни один `View` в текущем приложении не имеет обработчика касания или layout-события. События нажатия принадлежат вложенным `Button`. `View` здесь отвечает только за структуру.

### Связь со state

Большинство контейнеров не читает state напрямую. `historyCard` содержит условную ветку, зависящую от `history.length`, но сам `View` получает только статический style. При изменении state компонент `App` рендерится заново, и дети контейнера меняются.

### Доступность

Контейнеры не получают `accessibilityLabel` и не объединяются в один доступный элемент. Это сохраняет отдельную фокусировку интерактивных детей и чтение текстовых элементов. Делать всю карточку `accessible={true}` без необходимости было бы рискованно: ассистивная технология могла бы воспринимать группу как один элемент.

### Типичная ошибка

**Ошибка:** поместить сырой текст непосредственно внутрь `View`:

```jsx
<View>Result: 41</View>
```

В React Native текст должен находиться в `Text`.

### Модельный ответ ученицы

«`View` — контейнер компоновки. В этом проекте он группирует экран, карточки и две кнопки. Он не хранит state и не обрабатывает нажатие; событие находится на `Button`».

## 4. `Text`: статический и динамический текст

### Категория

`Text` — компонент React Native для текстового содержимого. Он необходим и для статической подписи, и для строки, вычисленной из state.

### Точный фрагмент текущего `App.js`

```jsx
<Text accessibilityLiveRegion="polite" style={styles.error} testID="error-message">
  {errorMessage}
</Text>
<Text accessibilityLiveRegion="polite" style={styles.result} testID="result-message">
  {resultMessage}
</Text>
```

Для строки истории используется точный callback:

```jsx
renderItem={({ item }) => <Text style={styles.historyItem}>{item.expression}</Text>}
```

### Props

| Prop | Где используется | Значение |
|---|---|---|
| `style` | Все девять экземпляров | Выбирает типографику, цвет, отступы и фон |
| `children` | Статические строки или выражения JSX | Например `Calculator History`, `{errorMessage}`, `{item.expression}` |
| `accessibilityLiveRegion` | Ошибка и результат | `polite` просит объявить изменение без немедленного прерывания текущей речи на Android |
| `testID` | Ошибка и результат | Точные id `error-message` и `result-message` |
| `accessibilityLabel` | Пустое состояние | Точное имя `Empty history message` |

### События

Текущие `Text` не интерактивны: у них нет `onPress`. Они обновляются вследствие setter-вызовов в других обработчиках.

### Связь со state

- `{errorMessage}` читает state `errorMessage`;
- `{resultMessage}` читает `resultMessage`;
- `{item.expression}` читает текущий объект из `history` через `FlatList.renderItem`;
- пустое сообщение выбирается условием `history.length === 0`.

### Доступность

`errorMessage` и `resultMessage` намеренно не имеют `accessibilityLabel`. Их доступное содержание — фактический изменяемый текст. Тесты прямо проверяют отсутствие этого prop. `testID` помогает тесту, но не заменяет пользовательское доступное имя. `accessibilityLiveRegion="polite"` в текущем React Native относится к Android.

### Типичная ошибка

**Ошибка:** поставить `accessibilityLabel="Result"` на динамический результат. Экранный диктор может прочитать только статическое имя и скрыть число. Текущий код оставляет содержимое `Result: 9` доступным напрямую.

### Модельный ответ ученицы

«`Text` показывает как постоянные подписи, так и данные state. Ошибка и результат получают live region и testID, но не статический accessibilityLabel, чтобы актуальное сообщение оставалось читаемым».

## 5. `TextInput`: два управляемых поля

### Категория

`TextInput` — интерактивный компонент ввода текста. Оба экземпляра управляются React state.

### Точный фрагмент текущего `App.js`

```jsx
<TextInput
  accessibilityLabel="First number"
  keyboardType="numeric"
  onChangeText={setFirstInput}
  placeholder="Enter a number"
  placeholderTextColor="#64748b"
  style={styles.input}
  value={firstInput}
/>
```

Второй экземпляр отличается точными связями `accessibilityLabel="Second number"`, `onChangeText={setSecondInput}` и `value={secondInput}`.

### Props

| Prop | Первое поле | Второе поле | Назначение |
|---|---|---|---|
| `accessibilityLabel` | `First number` | `Second number` | Доступное имя и устойчивый селектор в тесте |
| `keyboardType` | `numeric` | `numeric` | Просит платформу показать числовую клавиатуру |
| `onChangeText` | `setFirstInput` | `setSecondInput` | Получает новую строку и обновляет соответствующий state |
| `placeholder` | `Enter a number` | `Enter a number` | Подсказка при пустом значении |
| `placeholderTextColor` | `#64748b` | `#64748b` | Явный цвет placeholder |
| `style` | `styles.input` | `styles.input` | Рамка, фон, отступы и размер текста |
| `value` | `firstInput` | `secondInput` | Текущее отображаемое значение из state |

### События

`onChangeText` получает уже строку, а не web-объект события. Цепочка первого поля:

```text
пользователь меняет текст
→ onChangeText(nextText)
→ setFirstInput(nextText)
→ новый рендер
→ value={firstInput}
```

Вычисление не запускается этим событием. Оно запускается только `onPress` кнопки.

### Связь со state

Первое поле читает `firstInput` и пишет через `setFirstInput`. Второе читает `secondInput` и пишет через `setSecondInput`. В state остаются строки, в том числе пустота, пробелы и незавершённый ввод. `handleCalculation` читает обе строки только при нажатии.

### Доступность

Видимые `Text`-подписи `First number` и `Second number` помогают зрячему пользователю, а одноимённые `accessibilityLabel` дают явные доступные имена. Placeholder не используется как единственная подпись: он исчезает после ввода.

### Типичные ошибки

1. Считать `keyboardType="numeric"` валидатором. Он только влияет на клавиатуру; вставка и физический ввод могут содержать другое.
2. Убрать `value` и оставить только `onChangeText`. Поле станет не полностью управляемым.
3. Писать `onChangeText={(event) => setFirstInput(event.target.value)}` по web-привычке. Здесь callback уже получает строку.
4. Преобразовывать каждую строку через `Number` немедленно: `Number('')` даст `0`, а промежуточный ввод потеряется.

### Модельный ответ ученицы

«Поле управляемое: `value` берётся из `firstInput`, а `onChangeText` вызывает `setFirstInput` с новой строкой. `keyboardType` улучшает ввод, но корректность определяет `parseNumberInput` после нажатия».

## 6. `Button`: команды `+` и `-`

### Категория

`Button` — нативный интерактивный компонент для простой кнопки.

### Точный фрагмент текущего `App.js`

```jsx
<View style={styles.buttonCell}>
  {/* Стрелка передаёт обработчик события, а не запускает вычисление во время рендера. */}
  <Button title="+" onPress={() => handleCalculation('+')} color="#2563eb" />
</View>
<View style={styles.buttonCell}>
  <Button title="-" onPress={() => handleCalculation('-')} color="#2563eb" />
</View>
```

### Props

| Prop | Кнопка сложения | Кнопка вычитания | Назначение |
|---|---|---|---|
| `title` | `+` | `-` | Видимое название и доступное имя нативной кнопки |
| `onPress` | `() => handleCalculation('+')` | `() => handleCalculation('-')` | Функция, выполняемая после нажатия |
| `color` | `#2563eb` | `#2563eb` | Платформенно-зависимый основной цвет нативной кнопки |

### События

`onPress` — единственное явно используемое событие кнопки. Стрелочная функция нужна, чтобы передать параметр и отложить вызов до события.

### Связь со state

`Button` не получает state props напрямую. Через `handleCalculation` он:

- читает `firstInput` и `secondInput`;
- при ошибке пишет `errorMessage`;
- при успехе пишет `history`, `errorMessage` и `resultMessage`;
- при успехе меняет `nextHistoryIdRef.current`.

### Доступность

Нативная кнопка имеет роль кнопки, а `title` задаёт имя `+` или `-`. Именно поэтому тест может искать `getByRole('button', { name: '+' })`. Символы кратки; при расширении приложения словесные hint/label могли бы сделать действие ещё яснее, но текущие тесты и интерфейс используют точные имена `+` и `-`.

### Типичная ошибка

```jsx
<Button title="+" onPress={handleCalculation('+')} />
```

Такой код вызывает `handleCalculation` во время рендера и передаёт в `onPress` его результат. Правильно: `onPress={() => handleCalculation('+')}`.

### Модельный ответ ученицы

«Кнопка получает callback, а не готовый результат вызова. Стрелка сохраняет символ операции и запускает `handleCalculation` только после нажатия».

## 7. `FlatList`: хронологическая история

### Категория

`FlatList` — компонент React Native для производительного отображения плоского списка. В проекте он монтируется только при непустом `history`.

### Точный фрагмент текущего `App.js`

```jsx
<FlatList
  accessibilityLabel="Calculation history"
  contentContainerStyle={styles.historyList}
  data={history}
  // Текст выражения может повторяться, поэтому ключом служит уникальный стабильный id.
  keyExtractor={getHistoryEntryKey}
  renderItem={({ item }) => <Text style={styles.historyItem}>{item.expression}</Text>}
/>
```

### Props

| Prop | Текущее значение | Назначение |
|---|---|---|
| `accessibilityLabel` | `Calculation history` | Доступное имя списка и селектор теста |
| `contentContainerStyle` | `styles.historyList` | Задаёт `gap: 8` внутреннему контейнеру элементов |
| `data` | `history` | Массив объектов `{ id, expression }` |
| `keyExtractor` | `getHistoryEntryKey` | Возвращает `entry.id` для стабильного React key |
| `renderItem` | Callback с `{ item }` | Возвращает `Text` с `item.expression` |

### События и callbacks

В текущем коде нет scroll-, refresh- или press-событий `FlatList`. `renderItem` вызывается списком для нужных элементов; `keyExtractor` вызывается для получения ключа. Это callbacks рендера, а не пользовательские команды вычисления.

### Связь со state

`data={history}` напрямую читает state. `appendHistory` создаёт новый массив, а `setHistory(previous => ...)` передаёт его React. Новая ссылка `data` позволяет списку увидеть изменение. Элементы идут в порядке массива, поэтому новая запись появляется ниже предыдущих.

### Доступность

Список имеет точное имя `Calculation history`. Каждая строка — обычный `Text` с выражением. До появления списка отдельный `Text` имеет имя `Empty history message`. Эти две ветки не существуют одновременно.

### Типичные ошибки

1. `keyExtractor={(item) => item.expression}` — ломается на допустимых дубликатах.
2. `keyExtractor={(item, index) => String(index)}` — ключ описывает позицию, а не запись.
3. `history.push(entry); setHistory(history)` — сохраняет ту же ссылку и мутирует прошлое состояние.
4. `data={[...history]}` при каждом рендере как попытка скрыть мутацию — создаёт ссылку, но не исправляет уже повреждённую модель.

### Модельный ответ ученицы

«`FlatList` получает массив `history`. `renderItem` показывает `item.expression`, а `keyExtractor` возвращает уникальный `item.id`. Новый объект добавляется в конец нового массива, поэтому порядок хронологический».

## 8. `StatusBar`: системная строка состояния

### Категория

`StatusBar` импортирован из `expo-status-bar`. Это Expo-компонент, а не `StatusBar` из `react-native`.

### Точный фрагмент текущего `App.js`

```jsx
<StatusBar style="dark" />
```

### Props

| Prop | Значение | Эффект |
|---|---|---|
| `style` | `dark` | Просит использовать тёмное содержимое системной строки состояния на светлом фоне |

### События

Текущий `StatusBar` не имеет событий и callbacks.

### Связь со state

Компонент не читает state и не меняется при вычислениях. Его настройка статична.

### Доступность

`StatusBar` не является элементом формы и не получает доступное имя. Его вклад — визуальная читаемость системных индикаторов на фоне `#f8fafc`.

### Типичная ошибка

Перепутать источник импорта и сверять props с другим одноимённым компонентом. В текущем коде точный импорт — `import { StatusBar } from 'expo-status-bar';`.

### Модельный ответ ученицы

«Expo `StatusBar` настраивает системную область, не участвует в state калькулятора и использует `style="dark"` для светлого экрана».

## 9. `useState`: React hook, а не контрол

### Категория

`useState` — React hook. Он не создаёт нативный элемент и не имеет props.

### Точный фрагмент текущего `App.js`

```js
const [firstInput, setFirstInput] = useState('');
const [secondInput, setSecondInput] = useState('');
const [resultMessage, setResultMessage] = useState('Result:');
const [errorMessage, setErrorMessage] = useState('');
const [history, setHistory] = useState([]);
```

Точные обновления успешной ветки:

```js
setHistory((previous) => appendHistory(previous, entry));
setErrorMessage('');
setResultMessage(`Result: ${formatNumber(calculation.value)}`);
```

### Аргумент и возвращаемое значение

`useState(initialState)` получает начальное значение и возвращает пару `[currentValue, setter]`. В проекте есть четыре строковых state и один массив.

### Событийная связь

Hook сам не ловит события. Setter-функции вызываются:

- `setFirstInput` и `setSecondInput` из `TextInput.onChangeText`;
- `setErrorMessage` из `handleCalculation` в обеих ветках;
- `setHistory` и `setResultMessage` из успешной ветки `handleCalculation`.

Setter планирует новый рендер. Значение в уже выполняющемся обработчике не меняется мгновенно как обычная локальная переменная.

### Связь с доступностью

`useState` не имеет доступных props. Его значения становятся доступным содержимым через `Text` и `TextInput`. Например, новый `errorMessage` изменяет текст live region.

### Типичные ошибки

1. Вызывать hook внутри условия или обработчика, а не на верхнем уровне `App`.
2. Мутировать `history`.
3. Писать `setHistory(appendHistory(history, entry))` там, где обновление зависит от ожидающей предыдущей версии.
4. Читать `history` сразу после setter и ожидать уже новое значение.
5. Хранить в state то, что не влияет на рендер, например технический счётчик id.

### Модельный ответ ученицы

«`useState` хранит данные, которые влияют на JSX. Setter запрашивает новый рендер. Для истории используется updater, потому что новое значение строится из предыдущего массива».

## 10. `useRef`: React hook для следующего id

### Категория

`useRef` — React hook. Он не является контролом и не выводит данные на экран.

### Точные фрагменты текущего `App.js`

Создание:

```js
const nextHistoryIdRef = useRef(1);
```

Чтение и изменение:

```js
const entry = createHistoryEntry(
  `history-${nextHistoryIdRef.current}`,
  first,
  operation,
  second,
  calculation.value,
);

nextHistoryIdRef.current += 1;
```

### Аргумент и возвращаемое значение

`useRef(1)` создаёт стабильный объект с начальным `current = 1`. При последующих рендерах возвращается тот же ref-объект.

### Событийная связь

Ref читается и увеличивается внутри `handleCalculation`, то есть после события `Button.onPress`. В ветке ошибки выполнение заканчивается раньше, поэтому `current` не меняется.

### Связь со state

`nextHistoryIdRef` — не state. Его изменение не планирует рендер. Однако текущее значение участвует в создании объекта, который затем попадает в `history` state и становится видимым списку.

### Доступность

Ref не имеет прямой доступности. Косвенный эффект — уникальные ключи помогают React надёжно сопоставлять строки списка, а пользователю доступны сами выражения.

### Типичные ошибки

1. Написать `let nextHistoryId = 1` внутри `App` — значение сбросится при каждом рендере.
2. Пытаться отобразить изменяющийся `ref.current` и ждать автоматического обновления UI.
3. Увеличивать `current` до проверки — ошибки начнут пропускать id.
4. Сбрасывать id при обычном очищении массива и путать это с полным remount.

### Модельный ответ ученицы

«`useRef` хранит технический счётчик между рендерами. Он меняется только после успешной записи и не вызывает отдельный рендер, потому что счётчик сам не показывается».

## 11. `StyleSheet`: React Native API, а не контрол

### Категория

`StyleSheet` — API из `react-native`. Вызов `StyleSheet.create` принимает объект именованных стилей. Нативного элемента сам API не создаёт.

### Точный фрагмент текущего `App.js`

```js
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 36,
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#dbe4f0',
  },
  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 6,
  },
  label: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0f172a',
    backgroundColor: '#ffffff',
    fontSize: 17,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  buttonCell: {
    flex: 1,
  },
  error: {
    minHeight: 20,
    color: '#b91c1c',
    fontWeight: '600',
  },
  result: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '700',
  },
  historyCard: {
    flex: 1,
    minHeight: 140,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#dbe4f0',
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    color: '#1e293b',
    fontSize: 17,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
});
```

### Аргумент, результат и применение

- аргумент `create` — объект, где ключи `safeArea`, `screen` и далее являются именами стилей;
- результат сохраняется в `styles`;
- экземпляры компонентов получают ссылки через `style={styles.input}` или `contentContainerStyle={styles.historyList}`;
- стиль статичен и не зависит от state.

### События и state

`StyleSheet` не имеет событий. Текущие стили не меняются по состоянию ошибки или наличию истории: условно меняются компоненты и их текст, а не объект стилей.

### Связь с доступностью

Стиль влияет на читаемость, размер и пространственную структуру, но не задаёт семантическое имя. В текущей палитре расчётные контрасты текста составляют:

| Текст / фон | Контраст |
|---|---:|
| `#0f172a` / `#ffffff` | 17.85:1 |
| `#475569` / `#ffffff` | 7.58:1 |
| `#64748b` / `#ffffff` | 4.76:1 |
| `#b91c1c` / `#ffffff` | 6.47:1 |
| `#1e293b` / `#eff6ff` | 13.44:1 |

Ошибка выражена не только красным цветом, но и точным текстом. `minHeight: 20` сохраняет место под строку ошибки и уменьшает скачок макета. Видимые подписи не исчезают при заполнении полей.

### Типичные ошибки

1. Использовать CSS-строку `'16px'` вместо числа `16` для размеров React Native.
2. Писать kebab-case `background-color` вместо `backgroundColor`.
3. Считать `StyleSheet` визуальным компонентом и пытаться поместить `<StyleSheet />` в JSX.
4. Полагаться только на цвет для передачи ошибки.
5. Путать `style` элемента и `contentContainerStyle` внутреннего контейнера списка.

### Модельный ответ ученицы

«`StyleSheet.create` — API для именованных объектов стиля. Компоненты получают ссылки через props. Он не ловит события, не хранит state и не заменяет accessibility props».

## 12. JavaScript API и функции проекта

Эти элементы также фактически участвуют в `App.js`, но не являются React Native-компонентами.

### Точный фрагмент импорта чистой логики

```js
import {
  appendHistory,
  calculateValues,
  createHistoryEntry,
  formatNumber,
  getHistoryEntryKey,
} from './src/calculator-history';
```

| Элемент | Категория | Вход | Результат | Связь с UI |
|---|---|---|---|---|
| `calculateValues` | Чистая функция проекта | Два текста и операция | `{ ok, value }` или `{ ok, error }` | Определяет ветку `handleCalculation` |
| `createHistoryEntry` | Чистая функция проекта | id, операнды, операция, результат | `{ id, expression }` | Создаёт элемент `history` |
| `appendHistory` | Чистая функция проекта | Массив и запись | Новый массив | Передаётся в `setHistory` |
| `formatNumber` | Чистая функция проекта | Число | Строка | Формирует `resultMessage` и `expression` |
| `getHistoryEntryKey` | Чистая функция проекта | Запись | `entry.id` | Передаётся в `FlatList.keyExtractor` |
| `String.prototype.trim` | JavaScript API | Строка | Строка без крайних пробелов | Нормализует успешные операнды |
| `String.prototype.replace` | JavaScript API | `','` и `'.'` | Строка с точкой | Поддерживает десятичную запятую |
| `Number` | JavaScript API | Нормализованная строка | Число | Готовит операнды записи |
| `Array spread` | Синтаксис JavaScript | Элементы прошлого массива | Новый массив | Обеспечивает неизменяемость |

Типичная ошибка — назвать `calculateValues` обработчиком кнопки. Она ничего не знает о событии и state; обработчик — `handleCalculation`, а чистая функция лишь возвращает значение-контракт.

## 13. Доступность и тестовые селекторы

### Полная карта

| Экземпляр | Доступность в коде | Точный текст/значение | Как используется тестом |
|---|---|---|---|
| Первый `TextInput` | `accessibilityLabel` | `First number` | `getByLabelText('First number')` |
| Второй `TextInput` | `accessibilityLabel` | `Second number` | `getByLabelText('Second number')` |
| Кнопка `+` | Нативная роль и `title` | `button` / `+` | `getByRole('button', { name: '+' })` |
| Кнопка `-` | Нативная роль и `title` | `button` / `-` | `getByRole('button', { name: '-' })` |
| Ошибка | `accessibilityLiveRegion="polite"`, `testID` | `error-message` | `getByTestId('error-message')` |
| Результат | `accessibilityLiveRegion="polite"`, `testID` | `result-message` | `getByTestId('result-message')` |
| Пустая история | `accessibilityLabel` | `Empty history message` | `getByLabelText('Empty history message')` |
| `FlatList` | `accessibilityLabel` | `Calculation history` | `getByLabelText('Calculation history')` |
| Строка истории | Собственный текст | Например `36 + 5 = 41` | Проверяется через `FlatList.props.data` |

### Важные различия

- `accessibilityLabel` предназначен ассистивным технологиям и может использоваться семантическим тестом.
- `testID` — технический селектор и сам по себе не объясняет назначение пользователю.
- `placeholder` не заменяет подпись: после ввода он исчезает.
- `accessibilityLiveRegion="polite"` уведомляет об изменении на Android; это не визуальный стиль и не state.
- `styles.error` задаёт цвет, но смысл ошибки передаётся текстом.
- Статические визуальные `Text`-подписи над полями не связаны через `nativeID`, однако точные `accessibilityLabel` непосредственно именуют оба поля.
- Корневые `View` не объявлены единым доступным элементом, поэтому не поглощают дочерние controls.

### Ручная проверка

1. Перемещать фокус экранного диктора по первому и второму полю; услышать разные имена.
2. Найти обе кнопки как кнопки, а не обычный текст.
3. На Android выполнить расчёт и дождаться вежливого объявления результата.
4. Создать ошибку и услышать точное сообщение.
5. До расчёта услышать `Empty history message`, после расчёта — `Calculation history` и выражение.
6. Убедиться, что `Result: 9` читается с числом, а не только как «Result».

## 14. Матрица «экземпляр интерфейса → state → событие → результат»

В колонке «экземпляр» перечислены UI-компоненты. Hooks и `StyleSheet` в матрицу контролов не включены.

| Экземпляр интерфейса | Компонент | Читает | Событие / callback | Что изменяет | Видимый результат |
|---|---|---|---|---|---|
| Поле `First number` | `TextInput` | `firstInput` через `value` | `onChangeText` | `setFirstInput(nextText)` | Поле показывает новую строку |
| Поле `Second number` | `TextInput` | `secondInput` | `onChangeText` | `setSecondInput(nextText)` | Поле показывает новую строку |
| Кнопка `+` | `Button` | Косвенно оба input state | `onPress` | Через handler: ошибка либо история, результат и ref | Сумма или сообщение ошибки |
| Кнопка `-` | `Button` | Косвенно оба input state | `onPress` | Через handler: ошибка либо история, результат и ref | Разность или сообщение ошибки |
| Строка ошибки | `Text` | `errorMessage` | Прямого события нет | Ничего | Пустота либо точная ошибка |
| Строка результата | `Text` | `resultMessage` | Прямого события нет | Ничего | `Result:` или последний успех |
| Пустое состояние | `Text` | Условие `history.length === 0` | Прямого события нет | Ничего | `No calculations yet.` |
| История | `FlatList` | `history` через `data` | `renderItem` и `keyExtractor` | Ничего | Строки в порядке массива |
| Строка истории | `Text` | `item.expression` | Создаётся `renderItem` | Ничего | Например `69 + 25 = 94` |
| Системная строка | `StatusBar` | State не читает | Нет | Ничего | Тёмные системные индикаторы |

### Матрица обновлений `handleCalculation`

| Ветка | `firstInput` | `secondInput` | `resultMessage` | `errorMessage` | `history` | `nextHistoryIdRef.current` |
|---|---|---|---|---|---|---|
| Ошибка ввода | без изменения | без изменения | без изменения | точная ошибка | без изменения | без изменения |
| Переполнение | без изменения | без изменения | без изменения | ошибка диапазона | без изменения | без изменения |
| Успех | без изменения | без изменения | новый `Result: ...` | `''` | новый массив + запись | `+1` |
| Полный remount | `''` | `''` | `Result:` | `''` | `[]` | `1` |

## 15. Аналоги в web-разработке

Аналоги помогают перенести знания, но не означают полное равенство платформ.

| React Native | Ближайший web-аналог | Ключевое отличие |
|---|---|---|
| `View` | `div` / `section` | Нет HTML-тега и CSS cascade; layout по умолчанию Flexbox с колонкой |
| `Text` | `span` / `p` / `h1` | Весь сырой текст должен находиться внутри `Text` |
| `TextInput` | `input type="text"` | `onChangeText` сразу отдаёт строку; нет `event.target.value` |
| `Button` | `button` | Нативный внешний вид и более ограниченная стилизация через `color` |
| `FlatList` | `ul` + `map` либо виртуализированный список | Рендерит окно элементов и требует `data` / `renderItem` |
| Expo `StatusBar` | Прямого DOM-аналога нет | Управляет системной областью устройства |
| `StyleSheet.create` | CSS-модуль или объект inline styles | Это JavaScript API; имена camelCase, размеры часто числа без `px` |
| `useState` | Тот же React hook | Семантика React та же, но результат отображается нативными компонентами |
| `useRef` | Тот же React hook | Здесь ref хранит данные, а не DOM-узел |
| `accessibilityLabel` | `aria-label` | Платформенный prop React Native |
| `keyboardType="numeric"` | `inputmode="numeric"` | Оба являются подсказкой способу ввода, а не полной валидацией |
| `testID` | `data-testid` | Технический селектор, не пользовательская семантика |

Типичная web-интерференция:

```jsx
// Web-привычка — не текущий контракт React Native:
onChange={(event) => setFirstInput(event.target.value)}

// Текущий React Native-код:
onChangeText={setFirstInput}
```

## 16. Мини-упражнения

### Упражнение 1. Найти источник истины

**Задание:** поле визуально содержит `2,5`. Где хранится точное значение?  
**Ответ:** строка `'2,5'` хранится в `firstInput` или `secondInput`; prop `value` возвращает её полю.

### Упражнение 2. Исправить событие

**Задание:** исправить `onPress={handleCalculation('-')}`.  
**Ответ:** `onPress={() => handleCalculation('-')}`, потому что нужен отложенный callback.

### Упражнение 3. Классифицировать элемент

**Задание:** является ли `useRef` контролом?  
**Ответ:** нет. Это React hook, возвращающий стабильный ref-объект.

### Упражнение 4. Предсказать state ошибки

**Задание:** после `Result: 41` второе поле очищено и нажата `+`. Что изменится?  
**Ответ:** только `errorMessage` станет `Enter a valid number.`. `resultMessage`, `history` и ref сохранятся.

### Упражнение 5. Выбрать ключ

**Задание:** есть две строки `36 + 5 = 41`. Выбрать `expression`, индекс или `id`.  
**Ответ:** `id`, потому что он уникален и связан с записью, а не с повторяемым текстом или позицией.

### Упражнение 6. Объяснить ререндер

**Задание:** что само по себе вызовет рендер — `nextHistoryIdRef.current += 1` или `setHistory(...)`?  
**Ответ:** setter state. Изменение `ref.current` само рендер не планирует.

### Упражнение 7. Сопоставить селектор

**Задание:** чем тест находит ошибку и чем пользователь понимает её содержание?  
**Ответ:** тест — через `testID="error-message"`; пользователь получает
фактический текст, а на Android TalkBack дополнительно использует live region.
VoiceOver на iOS проверяется отдельно.

### Упражнение 8. Исправить web-синтаксис

**Задание:** заменить `onChangeText={(event) => setSecondInput(event.target.value)}`.  
**Ответ:** `onChangeText={setSecondInput}` или `onChangeText={(text) => setSecondInput(text)}`.

### Упражнение 9. Предсказать список

**Задание:** что рендерится при `history = []`?  
**Ответ:** `Text` с `No calculations yet.` и `accessibilityLabel="Empty history message"`; `FlatList` ещё не смонтирован.

### Упражнение 10. Объяснить стиль

**Задание:** почему `styles.historyList` передан в `contentContainerStyle`, а не `style`?  
**Ответ:** `gap` должен применяться к внутреннему контейнеру строк. `style` оформлял бы внешний компонент списка.

## 17. Вопросы и полные ответы

1. **Какие элементы в проекте являются компонентами интерфейса?**  
   `View`, `Text`, `TextInput`, `Button`, `FlatList` и Expo `StatusBar`. Они встречаются в JSX и создают части нативного дерева.

2. **Какие элементы не следует называть контролами?**  
   `useState`, `useRef` и `StyleSheet`. Первые два — React hooks, последний — React Native API.

3. **Сколько управляемых полей в приложении?**  
   Два. Первое связывает `firstInput` / `setFirstInput`, второе — `secondInput` / `setSecondInput`.

4. **Почему `placeholder` не является достаточной подписью?**  
   Он исчезает после ввода и описывает ожидаемое содержимое, а не всегда назначение поля. Поэтому есть видимый `Text` и `accessibilityLabel`.

5. **Какое значение получает `onChangeText`?**  
   Новую строку поля. В отличие от типичного web `onChange`, читать `event.target.value` не нужно.

6. **Почему кнопка обёрнута в стрелочную функцию?**  
   `handleCalculation` требует аргумент операции. Стрелка сохраняет аргумент и остаётся callback до реального `onPress`.

7. **Что именно делает `color` у `Button`?**  
   Задаёт основной платформенный цвет нативной кнопки. Детали внешнего вида зависят от Android/iOS, поэтому для сложной кастомизации обычно выбирают `Pressable`, но текущему заданию достаточно `Button`.

8. **Почему `FlatList` появляется не сразу?**  
   JSX проверяет `history.length === 0`. Пока массив пуст, показывается отдельное сообщение; список создаётся в альтернативной ветке.

9. **Что получает `renderItem`?**  
   Объект контекста, из которого текущий код деструктурирует `item`. Затем возвращается `Text` с `item.expression`.

10. **Что возвращает `keyExtractor`?**  
    `getHistoryEntryKey(entry)` возвращает `entry.id`, например `history-2`.

11. **Почему новый массив важен для `FlatList`?**  
    Список сравнивает props поверхностно. Новая ссылка `data` сообщает, что коллекция изменилась; кроме того, прошлый state остаётся неизменным.

12. **Что означает `accessibilityLiveRegion="polite"`?**  
    На Android сервис доступности должен объявить изменение, когда это удобно, не прерывая немедленно текущую речь.

13. **Почему `testID` не заменяет `accessibilityLabel`?**  
    `testID` создан для автоматизации. `accessibilityLabel` передаёт человеку назначение элемента через ассистивную технологию.

14. **Почему `resultMessage` хранится в state, а не вычисляется из полей?**  
    Поля могут измениться после успешного расчёта. Результат должен показывать последнюю подтверждённую операцию, а не потенциальное значение незавершённого ввода.

15. **Что произойдёт при изменении `nextHistoryIdRef.current`?**  
    Значение сохранится, но отдельного рендера не будет. Рендер произойдёт вследствие `setHistory`, `setErrorMessage` или `setResultMessage`.

16. **Почему `View` не получает обработчик кнопки?**  
    Он используется как контейнер. Семантика и событие принадлежат нативному `Button`, что яснее и доступнее.

17. **Почему ошибка имеет `minHeight: 20`?**  
    Даже пустая строка сохраняет область, поэтому появление сообщения меньше сдвигает расположенный ниже результат.

18. **Как стили связаны со state?**  
    В текущей версии стили статичны. State меняет содержимое и ветки JSX; все ссылки `styles.*` остаются теми же.

19. **Как проверить доступность истории вручную?**  
    До расчёта найти `Empty history message`, затем выполнить операцию, найти `Calculation history` и прослушать выражение строки.

20. **В чём главная цепочка приложения?**  
    `TextInput` записывает строки в state; `Button` запускает `handleCalculation`; чистая логика возвращает успех или ошибку; setters обновляют сообщения и массив; `Text` и `FlatList` отображают новый state.

## 18. Официальные справочные материалы

Документ самодостаточен для текущего проекта. Для углубления можно свериться с публичными первичными источниками:

- [React Native 0.81: View](https://reactnative.dev/docs/0.81/view)
- [React Native 0.81: Text](https://reactnative.dev/docs/0.81/text)
- [React Native 0.81: TextInput](https://reactnative.dev/docs/0.81/textinput)
- [React Native 0.81: Button](https://reactnative.dev/docs/0.81/button)
- [React Native 0.81: FlatList](https://reactnative.dev/docs/0.81/flatlist)
- [React Native 0.81: StyleSheet](https://reactnative.dev/docs/0.81/stylesheet)
- [React Native 0.81: Accessibility](https://reactnative.dev/docs/0.81/accessibility)
- [React: useState](https://react.dev/reference/react/useState)
- [React: useRef](https://react.dev/reference/react/useRef)
- [Expo SDK 54: StatusBar](https://docs.expo.dev/versions/v54.0.0/sdk/status-bar/)

При ответе на защите приоритет имеет фактический код этого проекта: например, теоретическая возможность `FlatList.ListEmptyComponent` не меняет того, что текущая версия использует отдельный условный `Text`.
