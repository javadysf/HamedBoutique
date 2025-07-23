"use client";
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { Loading } from '@/components/common';
import { setToken } from '@/store/slices/userSlice';

interface ReduxProviderProps {
  children: React.ReactNode;
}

// کامپوننت برای بازیابی توکن از localStorage
const TokenInitializer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // بازیابی توکن از localStorage
    const token = localStorage.getItem("token");
    if (token) {
      store.dispatch(setToken(token));
    }
  }, []);

  return <>{children}</>;
};

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading size="large" text="در حال بارگذاری..." />} persistor={persistor}>
        <TokenInitializer>
          {children}
        </TokenInitializer>
      </PersistGate>
    </Provider>
  );
}; 