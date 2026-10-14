import { createContext, useContext, useRef, useState, type PropsWithChildren } from 'react';

export type HistoryEntry = {
  id: string;
  expression: string;
};

export type HistoryContextValue = {
  history: HistoryEntry[];
  addHistory: (expression: string) => void;
};

const HistoryContext = createContext<HistoryContextValue | undefined>(undefined);

export function HistoryProvider({ children }: PropsWithChildren): React.JSX.Element {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const nextIdRef = useRef(1);

  function addHistory(expression: string): void {
    setHistory((previous) => [
      ...previous,
      { id: String(nextIdRef.current++), expression },
    ]);
  }

  return <HistoryContext.Provider value={{ history, addHistory }}>{children}</HistoryContext.Provider>;
}

export function useCalculationHistory(): HistoryContextValue {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('HistoryProvider is required.');
  }

  return context;
}
