import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text, TextInput, View } from 'react-native';
import { calculate, formatNumber, type Operation } from './calculator';
import { useCalculationHistory } from './history-context';
import type { RootStackParamList } from './navigation-types';

type CalculatorScreenProps = NativeStackScreenProps<RootStackParamList, 'Calculator'>;

export default function CalculatorScreen({ navigation }: CalculatorScreenProps): React.JSX.Element {
  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const { addHistory } = useCalculationHistory();

  function handleCalculation(operation: Operation): void {
    const result = calculate(firstInput, secondInput, operation);
    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    addHistory(result.expression);
    setErrorMessage('');
    setResultMessage(`Result: ${formatNumber(result.value)}`);
  }

  return (
    <View style={{ gap: 12, padding: 16 }}>
      <Text>First number</Text>
      <TextInput
        accessibilityLabel="First number"
        keyboardType="decimal-pad"
        placeholder="e.g. 23"
        value={firstInput}
        onChangeText={setFirstInput}
      />
      <Text>Second number</Text>
      <TextInput
        accessibilityLabel="Second number"
        keyboardType="decimal-pad"
        placeholder="e.g. 12"
        value={secondInput}
        onChangeText={setSecondInput}
      />
      <Button title="ADD" onPress={() => handleCalculation('+')} />
      <Button title="SUBTRACT" onPress={() => handleCalculation('-')} />
      <Button title="VIEW HISTORY" onPress={() => navigation.navigate('History')} />
      {errorMessage ? (
        <Text
          accessibilityLabel="Calculation error"
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          {errorMessage}
        </Text>
      ) : null}
      {resultMessage ? (
        <Text accessibilityLabel="Calculation result" accessibilityLiveRegion="polite">
          {resultMessage}
        </Text>
      ) : null}
    </View>
  );
}
