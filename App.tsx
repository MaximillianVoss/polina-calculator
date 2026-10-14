import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalculatorScreen from './src/CalculatorScreen';
import HistoryScreen from './src/HistoryScreen';
import { HistoryProvider } from './src/history-context';
import type { RootStackParamList } from './src/navigation-types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.JSX.Element {
  return (
    <HistoryProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Calculator">
          <Stack.Screen name="Calculator" component={CalculatorScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </HistoryProvider>
  );
}
