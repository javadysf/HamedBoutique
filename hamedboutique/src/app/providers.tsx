"use client";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setToken } from "@/store/slices/userSlice";

// کامپوننت برای بازیابی توکن از localStorage
const TokenInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // بازیابی توکن از localStorage
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return <>{children}</>;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TokenInitializer>{children}</TokenInitializer>
      </PersistGate>
    </Provider>
  );
}