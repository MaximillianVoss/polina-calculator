import { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { calculateValues, formatNumber } from './src/calculator';

export default function App() {
  // TextInput возвращает строки. Храним исходный текст, чтобы пользователь мог
  // спокойно вводить знак минус, запятую и исправлять незавершённое число.
  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [resultMessage, setResultMessage] = useState('Result:');
  const [errorMessage, setErrorMessage] = useState('');

  /** Запускается только при нажатии + или -, то есть является обработчиком события. */
  function handleCalculation(operation) {
    const calculation = calculateValues(firstInput, secondInput, operation);

    // При ошибке показываем подсказку, но сохраняем последний верный результат.
    if (!calculation.ok) {
      setErrorMessage(calculation.error);
      return;
    }

    setErrorMessage('');
    setResultMessage(`Result: ${formatNumber(calculation.value)}`);
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.card}>
        <Text style={styles.eyebrow}>ASSIGNMENT 1</Text>
        <Text style={styles.title}>Calculator</Text>
        <Text style={styles.description}>
          Enter two numbers, then choose addition or subtraction.
        </Text>

        <Text
          accessibilityLiveRegion="polite"
          style={styles.result}
          testID="result-message"
        >
          {resultMessage}
        </Text>

        <View style={styles.fieldGroup}>
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
        </View>

        <View style={styles.fieldGroup}>
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
        </View>

        <Text
          accessibilityLiveRegion="assertive"
          style={styles.error}
          testID="error-message"
        >
          {errorMessage}
        </Text>

        <View style={styles.buttonRow}>
          <View style={styles.button}>
            <Button
              accessibilityHint="Adds the two entered numbers"
              color="#2563eb"
              onPress={() => handleCalculation('+')}
              title="+"
            />
          </View>
          <View style={styles.button}>
            <Button
              accessibilityHint="Subtracts the second number from the first"
              color="#0f766e"
              onPress={() => handleCalculation('-')}
              title="-"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    gap: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  eyebrow: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: {
    color: '#0f172a',
    fontSize: 32,
    fontWeight: '800',
  },
  description: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 23,
  },
  result: {
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    color: '#1e3a8a',
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 14,
    textAlign: 'center',
  },
  fieldGroup: {
    gap: 7,
  },
  label: {
    color: '#1e293b',
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: '#94a3b8',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: 18,
    paddingHorizontal: 14,
  },
  error: {
    minHeight: 22,
    color: '#b91c1c',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 8,
  },
});
