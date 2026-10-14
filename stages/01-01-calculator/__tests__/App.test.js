import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import App from '../App';

describe('Calculator screen', () => {
  test('adds and subtracts the entered numbers', () => {
    const ui = render(<App />);
    const first = ui.getByLabelText('First number');
    const second = ui.getByLabelText('Second number');

    expect(first).toHaveProp('keyboardType', 'numeric');
    expect(second).toHaveProp('keyboardType', 'numeric');
    expect(first).toHaveProp('placeholder', 'Enter a number');
    expect(second).toHaveProp('placeholder', 'Enter a number');

    fireEvent.changeText(first, '23');
    fireEvent.changeText(second, '12');
    fireEvent.press(ui.getByRole('button', { name: '+' }));
    expect(ui.getByTestId('result-message')).toHaveTextContent('Result: 35');

    fireEvent.press(ui.getByRole('button', { name: '-' }));
    expect(ui.getByTestId('result-message')).toHaveTextContent('Result: 11');
  });

  test('keeps the previous result when the next input is invalid', () => {
    const ui = render(<App />);
    const first = ui.getByLabelText('First number');
    const second = ui.getByLabelText('Second number');
    const add = ui.getByRole('button', { name: '+' });

    fireEvent.changeText(first, '23');
    fireEvent.changeText(second, '12');
    fireEvent.press(add);
    expect(ui.getByTestId('result-message')).toHaveTextContent('Result: 35');

    fireEvent.changeText(second, '');
    fireEvent.press(add);
    expect(ui.getByTestId('error-message')).toHaveTextContent(
      'Enter a valid number.',
    );
    expect(ui.getByTestId('result-message')).toHaveTextContent('Result: 35');

    fireEvent.changeText(second, '1');
    fireEvent.press(add);
    expect(ui.queryByText('Enter a valid number.')).toBeNull();
  });

  test('supports decimal comma and rejects an overflowing result', () => {
    const ui = render(<App />);
    const first = ui.getByLabelText('First number');
    const second = ui.getByLabelText('Second number');
    const add = ui.getByRole('button', { name: '+' });

    fireEvent.changeText(first, '2,5');
    fireEvent.changeText(second, '1.25');
    fireEvent.press(add);
    expect(ui.getByTestId('result-message')).toHaveTextContent('Result: 3.75');

    const hugeDecimal = '9'.repeat(308);
    fireEvent.changeText(first, hugeDecimal);
    fireEvent.changeText(second, hugeDecimal);
    fireEvent.press(add);
    expect(ui.getByTestId('error-message')).toHaveTextContent(
      'Result is too large.',
    );
    expect(ui.getByTestId('result-message')).toHaveTextContent('Result: 3.75');
  });
});
