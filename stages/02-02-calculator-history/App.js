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
import {
  appendHistory,
  calculateValues,
  createHistoryEntry,
  formatNumber,
  getHistoryEntryKey,
} from './src/calculator-history';

export default function App() {
  // TextInput сообщает текст, поэтому строки сохраняют пустое и незаконченное значение до нажатия кнопки.
  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [resultMessage, setResultMessage] = useState('Result:');
  const [errorMessage, setErrorMessage] = useState('');
  const [history, setHistory] = useState([]);

  // Счётчик не выводится на экран: useRef сохраняет его между рендерами, не вызывая лишний рендер.
  const nextHistoryIdRef = useRef(1);

  function handleCalculation(operation) {
    const calculation = calculateValues(firstInput, secondInput, operation);
    if (!calculation.ok) {
      setErrorMessage(calculation.error);
      return;
    }

    const first = Number(firstInput.trim().replace(',', '.'));
    const second = Number(secondInput.trim().replace(',', '.'));
    const entry = createHistoryEntry(
      `history-${nextHistoryIdRef.current}`,
      first,
      operation,
      second,
      calculation.value,
    );

    nextHistoryIdRef.current += 1;
    // Функциональный setter получает свежую историю и безопасно создаёт новый массив даже при быстрых событиях.
    setHistory((previous) => appendHistory(previous, entry));
    setErrorMessage('');
    setResultMessage(`Result: ${formatNumber(calculation.value)}`);
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Calculator History</Text>
          <Text style={styles.description}>Add or subtract two numbers and keep the results in order.</Text>

          <Text style={styles.label}>First number</Text>
          <TextInput
            accessibilityLabel="First number"
            keyboardType="numeric"
            onChangeText={setFirstInput}
            placeholder="Enter a number"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={firstInput}
          />

          <Text style={styles.label}>Second number</Text>
          <TextInput
            accessibilityLabel="Second number"
            keyboardType="numeric"
            onChangeText={setSecondInput}
            placeholder="Enter a number"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={secondInput}
          />

          <View style={styles.buttonRow}>
            <View style={styles.buttonCell}>
              {/* Стрелка передаёт обработчик события, а не запускает вычисление во время рендера. */}
              <Button title="+" onPress={() => handleCalculation('+')} color="#2563eb" />
            </View>
            <View style={styles.buttonCell}>
              <Button title="-" onPress={() => handleCalculation('-')} color="#2563eb" />
            </View>
          </View>

          <Text accessibilityLiveRegion="polite" style={styles.error} testID="error-message">
            {errorMessage}
          </Text>
          <Text accessibilityLiveRegion="polite" style={styles.result} testID="result-message">
            {resultMessage}
          </Text>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>History</Text>
          {history.length === 0 ? (
            <Text accessibilityLabel="Empty history message" style={styles.emptyText}>
              No calculations yet.
            </Text>
          ) : (
            <FlatList
              accessibilityLabel="Calculation history"
              contentContainerStyle={styles.historyList}
              data={history}
              // Текст выражения может повторяться, поэтому ключом служит уникальный стабильный id.
              keyExtractor={getHistoryEntryKey}
              renderItem={({ item }) => <Text style={styles.historyItem}>{item.expression}</Text>}
            />
          )}
        </View>

        {/* Постоянного хранилища нет по условию: полный перезапуск намеренно очищает историю. */}
      </View>
    </View>
  );
}

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
