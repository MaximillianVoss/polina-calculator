import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import App from '../App';

test('keeps different calculations in chronological FlatList order with stable keys', () => {
  const ui = render(<App />);
  expect(ui.getByLabelText('Empty history message')).toHaveTextContent('No calculations yet.');
  const first = ui.getByLabelText('First number');
  const second = ui.getByLabelText('Second number');
  const add = ui.getByRole('button', { name: '+' });
  const subtract = ui.getByRole('button', { name: '-' });

  fireEvent.changeText(first, '36');
  fireEvent.changeText(second, '5');
  fireEvent.press(add);
  fireEvent.changeText(first, '69');
  fireEvent.changeText(second, '25');
  fireEvent.press(add);
  fireEvent.changeText(first, '78');
  fireEvent.changeText(second, '69');
  fireEvent.press(subtract);

  const historyList = ui.getByLabelText('Calculation history');
  expect(historyList.props.data.map((entry) => entry.expression)).toEqual([
    '36 + 5 = 41',
    '69 + 25 = 94',
    '78 - 69 = 9',
  ]);
  expect(historyList.props.data.map((entry, index) => historyList.props.keyExtractor(entry, index))).toEqual([
    'history-1',
    'history-2',
    'history-3',
  ]);
  expect(ui.getByTestId('result-message')).toHaveTextContent('Result: 9');
  expect(ui.getByTestId('result-message')).not.toHaveProp('accessibilityLabel');
});

test('rejects overflow without changing the last result, history, or next id', () => {
  const ui = render(<App />);
  const first = ui.getByLabelText('First number');
  const second = ui.getByLabelText('Second number');
  const add = ui.getByRole('button', { name: '+' });
  const subtract = ui.getByRole('button', { name: '-' });
  fireEvent.changeText(first, '78');
  fireEvent.changeText(second, '69');
  fireEvent.press(subtract);
  expect(ui.getByTestId('result-message')).toHaveTextContent('Result: 9');

  const largeDecimal = '9'.repeat(308);
  fireEvent.changeText(first, largeDecimal);
  fireEvent.changeText(second, largeDecimal);
  fireEvent.press(add);
  expect(ui.getByTestId('error-message')).toHaveTextContent('Result is outside the supported number range.');
  expect(ui.getByTestId('error-message')).not.toHaveProp('accessibilityLabel');
  expect(ui.getByTestId('result-message')).toHaveTextContent('Result: 9');
  expect(ui.getByLabelText('Calculation history').props.data).toHaveLength(1);

  fireEvent.changeText(first, '69');
  fireEvent.changeText(second, '25');
  fireEvent.press(add);
  const historyList = ui.getByLabelText('Calculation history');
  expect(historyList.props.data.map((entry) => entry.expression)).toEqual(['78 - 69 = 9', '69 + 25 = 94']);
  expect(historyList.props.data.map((entry, index) => historyList.props.keyExtractor(entry, index))).toEqual([
    'history-1',
    'history-2',
  ]);
});
