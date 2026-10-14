# Компоненты и контролы проекта 01 — Calculator

## 1. Что в React Native называется контролом

В учебной речи «контрол» — интерактивный или отображающий элемент интерфейса.
В документации React Native чаще используется слово **component**.

В этом проекте визуальные компоненты:

- `View`;
- `Text`;
- `TextInput`;
- `Button`;
- `StatusBar` из пакета `expo-status-bar`.

`useState` — hook, `StyleSheet` — API стилей, а `onPress` и `onChangeText` —
props событий. Их важно понимать, но называть отдельными визуальными
контролами неправильно.

## 2. Карта компонентов и API

| Элемент | Категория | Количество/роль | Источник |
|---|---|---|---|
| `View` | контейнер | корень, карточка, группы полей и кнопок | `react-native` |
| `Text` | вывод текста | заголовки, подписи, результат и ошибка | `react-native` |
| `TextInput` | интерактивный ввод | два числовых поля | `react-native` |
| `Button` | интерактивное действие | сложение и вычитание | `react-native` |
| `StatusBar` | системный UI-компонент | тёмные системные значки | `expo-status-bar` |
| `useState` | React hook | четыре независимых значения state | `react` |
| `StyleSheet` | API | именованные наборы нативных стилей | `react-native` |

## 3. `View` — контейнер компоновки

`View` похож по назначению на универсальный контейнер, но отображается
нативным элементом платформы, а не HTML `div`.

Точный фрагмент корня:

```jsx
<View style={styles.screen}>
  <StatusBar style="dark" />

  <View style={styles.card}>
    {/* содержимое карточки */}
  </View>
</View>
```

Основной prop — `style`. В проекте он управляет flex-компоновкой, отступами,
цветом, шириной, тенью и скруглением.

Контейнер кнопок:

```jsx
<View style={styles.buttonRow}>
  <View style={styles.button}>...</View>
  <View style={styles.button}>...</View>
</View>
```

`buttonRow.flexDirection = 'row'` размещает кнопки горизонтально, а
`button.flex = 1` делит доступную ширину поровну.

Типичная ошибка: ожидать, что дочерние элементы автоматически выстроятся в
строку. По умолчанию направление React Native Flexbox — колонка.

Модельный ответ: «`View` группирует элементы и задаёт их компоновку; сам он не
хранит ввод и не выполняет вычисление».

## 4. `Text` — отображение текста

Обычный текст в React Native должен находиться внутри `Text`.

Статический пример:

```jsx
<Text style={styles.title}>Calculator</Text>
```

Динамический пример:

```jsx
<Text
  accessibilityLiveRegion="polite"
  style={styles.result}
  testID="result-message"
>
  {resultMessage}
</Text>
```

| Prop | Значение | Назначение |
|---|---|---|
| `style` | `styles.result` | оформление блока результата |
| `testID` | `result-message` | стабильный поиск в UI-тесте |
| `accessibilityLiveRegion` | `polite` | попросить TalkBack на Android сообщить об обновлении без резкого прерывания |

Для ошибки используется `accessibilityLiveRegion="assertive"`, потому что
ошибка требует более срочной обратной связи в TalkBack на Android. Этот prop
не гарантирует аналогичное автоматическое объявление VoiceOver на iOS — его
нужно проверить отдельно.

Типичная ошибка: написать строку прямо внутри `View`. В React Native текстовые
узлы размещают в `Text`.

Модельный ответ: «`Text` показывает либо постоянную строку, либо JavaScript-
выражение в фигурных скобках».

## 5. `TextInput` — управляемый ввод

Точный фрагмент первого поля:

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

### Props поля

| Prop | Что делает в проекте |
|---|---|
| `value` | берёт показанную строку из `firstInput` |
| `onChangeText` | передаёт новый текст в `setFirstInput` |
| `keyboardType="numeric"` | открывает удобную числовую клавиатуру |
| `placeholder` | показывает подсказку в пустом поле |
| `placeholderTextColor` | обеспечивает читаемость подсказки |
| `accessibilityLabel` | даёт полю однозначное доступное имя |
| `style` | оформляет границу, размер и текст |

### Главное ограничение

`keyboardType="numeric"` не превращает значение в number и не гарантирует
валидность. `onChangeText` всё равно получает строку, поэтому проверка живёт в
`parseNumberInput`.

Типичная ошибка: указать `value`, но забыть `onChangeText`. Поле станет
фактически нередактируемым.

Модельный ответ: «Это controlled input: React state является единственным
источником отображаемого значения».

## 6. `Button` — запуск действия

Кнопка сложения:

```jsx
<Button
  accessibilityHint="Adds the two entered numbers"
  color="#2563eb"
  onPress={() => handleCalculation('+')}
  title="+"
/>
```

| Prop | Роль |
|---|---|
| `title` | видимая подпись и доступное имя кнопки |
| `onPress` | функция, вызываемая после нажатия |
| `color` | платформенный цвет кнопки |
| `accessibilityHint` | поясняет результат действия экранному диктору |

Стрелочная функция нужна, чтобы отложить вызов и передать аргумент `'+'`.

Неверно:

```jsx
<Button onPress={handleCalculation('+')} title="+" />
```

Здесь вычисление запустится во время рендера, а в `onPress` попадёт результат
вызова.

Модельный ответ: «`Button` не считает сам; он только создаёт событие, которое
передаёт управление обработчику».

## 7. `StatusBar` — системная строка состояния

```jsx
<StatusBar style="dark" />
```

Компонент импортируется не из `react-native`, а из `expo-status-bar`.
`style="dark"` выбирает тёмные системные значки для светлого фона.

Он не связан со state калькулятора и не участвует в вычислениях. Его задача —
согласовать внешний вид системной области Android/iOS с экраном приложения.

Типичная ошибка: путать `StatusBar` с заголовком приложения. Это часть
системного интерфейса устройства.

## 8. `useState` — hook состояния

```js
const [firstInput, setFirstInput] = useState('');
const [secondInput, setSecondInput] = useState('');
const [resultMessage, setResultMessage] = useState('Result:');
const [errorMessage, setErrorMessage] = useState('');
```

Каждый вызов возвращает пару:

1. текущее значение;
2. setter для запроса обновления.

`useState` вызывается на верхнем уровне `App`, а не внутри `if` или
`handleCalculation`. Порядок hooks должен оставаться одинаковым при каждом
рендере.

Типичная ошибка: ожидать, что setter немедленно изменит локальную переменную в
текущем вызове функции. Setter планирует следующий render.

Модельный ответ: «State хранит данные, от которых зависит интерфейс; setter
сообщает React, что компонент нужно выполнить снова».

## 9. `StyleSheet` — API оформления

```js
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
});
```

React Native-стили являются JavaScript-объектами. Имена отличаются от CSS:
используется `backgroundColor`, а числовой `padding: 20` не содержит `px`.

Полезные свойства проекта:

- `flex`, `alignItems`, `justifyContent` — компоновка;
- `padding`, `gap` — расстояния;
- `borderRadius`, `borderWidth`, `borderColor` — форма;
- `fontSize`, `fontWeight`, `color` — текст;
- `shadow*` и `elevation` — тень iOS/Android.

`StyleSheet` — не контрол и не state. Он создаёт именованный набор стилей.

## 10. Доступность и тестовые идентификаторы

| Механизм | Где | Назначение |
|---|---|---|
| `accessibilityLabel` | оба `TextInput` | понятное имя поля для диктора и теста |
| `accessibilityHint` | обе кнопки | результат нажатия |
| `accessibilityLiveRegion` | результат и ошибка | динамическое объявление в TalkBack на Android; VoiceOver проверяется отдельно |
| `testID` | результат и ошибка | поиск меняющегося текста без подмены доступной подписи |

Почему динамическому `Text` не задан статический `accessibilityLabel`:
статическая метка могла бы скрыть фактическое значение `Result: 35` от
экранного диктора. `testID` решает задачу теста, не заменяя видимый текст.

## 11. Матрица «компонент → state → событие → результат»

| Компонент | Читает state | Событие | Setter/обработчик | Видимый результат |
|---|---|---|---|---|
| первое `TextInput` | `firstInput` | `onChangeText` | `setFirstInput` | новое значение первого поля |
| второе `TextInput` | `secondInput` | `onChangeText` | `setSecondInput` | новое значение второго поля |
| кнопка `+` | косвенно оба поля | `onPress` | `handleCalculation('+')` | сумма или ошибка |
| кнопка `-` | косвенно оба поля | `onPress` | `handleCalculation('-')` | разность или ошибка |
| `Text` результата | `resultMessage` | нет | обновляется обработчиком | `Result: ...` |
| `Text` ошибки | `errorMessage` | нет | обновляется обработчиком | сообщение ошибки |

## 12. Аналоги в обычном web React

| React Native | Приблизительный web-аналог | Важное отличие |
|---|---|---|
| `View` | `div` | отображается нативным контейнером, не DOM |
| `Text` | `p`, `span`, `h1` | весь обычный текст должен быть внутри `Text` |
| `TextInput` | `input` | использует `onChangeText`, а не чтение `event.target.value` |
| `Button` | `button` | получает `title`, внешний вид платформенный |
| `StyleSheet` | CSS/CSS-in-JS | числовые размеры без `px`, набор поддерживаемых свойств ограничен RN |
| `onPress` | `onClick` | единое событие нажатия для touch-интерфейса |

Это аналоги для понимания, а не взаимозаменяемые теги.

## 13. Полный путь одного события

Для нажатия `+` после ввода `23` и `12`:

```text
TextInput #1 --onChangeText--> setFirstInput('23')
TextInput #2 --onChangeText--> setSecondInput('12')
Button '+' --onPress--> handleCalculation('+')
handleCalculation --> calculateValues('23', '12', '+')
calculateValues --> { ok: true, value: 35 }
setResultMessage('Result: 35')
React render
Text(resultMessage) --> Result: 35
```

Ученица должна уметь воспроизвести цепочку без запуска приложения.

## 14. Мини-упражнения по компонентам

1. Поменять `title="+"` на `title="ADD"` и определить, изменилась ли логика.
2. Временно удалить `value={firstInput}` и объяснить различие controlled и
   uncontrolled поведения.
3. Изменить `keyboardType` и проверить клавиатуру на эмуляторе.
4. Поменять `flexDirection: 'row'` на `'column'` и описать результат.
5. Добавить статический `Text` под заголовком без нового state.
6. Изменить `accessibilityHint` кнопки, не меняя `title`.
7. Найти все места, где используется `errorMessage`.
8. Нарисовать таблицу props первого `TextInput` по памяти.

После каждого упражнения вернуть исходное состояние или оформить изменение
отдельным осознанным улучшением.

## 15. Вопросы преподавателя и ответы

1. **Какой компонент отвечает за ввод?**  
   `TextInput`; его значение связано со state через `value` и `onChangeText`.

2. **Какой компонент запускает вычисление?**  
   `Button` создаёт событие `onPress`, а вычисляет обработчик и чистая функция.

3. **Что хранит `View`?**  
   Дочерние компоненты и правила компоновки; числовые данные он не хранит.

4. **Почему результат — это `Text`, а не `TextInput`?**  
   Результат только отображается и не должен редактироваться пользователем.

5. **Делает ли `keyboardType="numeric"` ввод безопасным?**  
   Нет. Это подсказка платформе о клавиатуре, поэтому строка всё равно
   валидируется в JavaScript.

6. **Что является prop у кнопки?**  
   В проекте это `title`, `onPress`, `color` и `accessibilityHint`.

7. **Что является событием у поля?**  
   `onChangeText`, которое получает новую строку.

8. **Почему `useState` не является контролом?**  
   Hook не отображает UI; он даёт компоненту механизм хранения состояния.

9. **Почему `StyleSheet` не является контролом?**  
   Это API создания объектов стилей, а не элемент дерева JSX.

10. **Зачем нужен `StatusBar`?**  
    Чтобы оформить системную строку состояния в соответствии со светлым
    экраном приложения.

11. **Как тест находит динамический результат?**  
    По `testID="result-message"`, затем проверяет фактический текст.

12. **Какая минимальная формула controlled input?**  
    `value={state}` вместе с `onChangeText={setter}`.
