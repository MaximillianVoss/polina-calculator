import { fireEvent, render } from '@testing-library/react-native';
import App from '../App';

test('calculates, navigates to FlatList history, and retains the item after returning', () => {
  const ui = render(<App />);

  fireEvent.changeText(ui.getByLabelText('First number'), '23');
  fireEvent.changeText(ui.getByLabelText('Second number'), '12');
  fireEvent.press(ui.getByRole('button', { name: 'ADD' }));

  expect(ui.getByLabelText('Calculation result')).toHaveTextContent('Result: 35');
  expect(ui.getByLabelText('Calculation result')).toHaveProp('accessibilityLiveRegion', 'polite');

  fireEvent.press(ui.getByRole('button', { name: 'VIEW HISTORY' }));
  expect(ui.getByText('23 + 12 = 35')).toBeOnTheScreen();

  fireEvent.press(ui.getByRole('button', { name: 'GO BACK' }));
  fireEvent.press(ui.getByRole('button', { name: 'VIEW HISTORY' }));
  expect(ui.getByText('23 + 12 = 35')).toBeOnTheScreen();
});

test('exposes a calculation validation error as an assertive alert', () => {
  const ui = render(<App />);

  fireEvent.press(ui.getByRole('button', { name: 'ADD' }));

  expect(ui.getByRole('alert', { name: 'Calculation error' })).toHaveProp(
    'accessibilityLiveRegion',
    'assertive',
  );
});
