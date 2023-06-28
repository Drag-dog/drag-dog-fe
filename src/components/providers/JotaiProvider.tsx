import { createStore, Provider } from "jotai";

export const JotaiProvider = ({ children }: { children: React.ReactNode }) => {
  const store = createStore();
  return <Provider {...store}>{children}</Provider>;
};
