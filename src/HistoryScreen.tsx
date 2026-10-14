import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, FlatList, Text, View } from 'react-native';
import { useCalculationHistory, type HistoryEntry } from './history-context';
import type { RootStackParamList } from './navigation-types';

type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'History'>;

export default function HistoryScreen({ navigation }: HistoryScreenProps): React.JSX.Element {
  const { history } = useCalculationHistory();

  function renderHistoryEntry({ item }: { item: HistoryEntry }): React.JSX.Element {
    return <Text>{item.expression}</Text>;
  }

  return (
    <View style={{ gap: 12, padding: 16 }}>
      {history.length === 0 ? <Text>No calculations yet.</Text> : null}
      <FlatList data={history} keyExtractor={(item) => item.id} renderItem={renderHistoryEntry} />
      <Button title="GO BACK" onPress={() => navigation.goBack()} />
    </View>
  );
}
