import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import alertReducer from "./slices/alertSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice"; // <-- new

const rootReducer = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  cart: cartReducer, // <-- added cart
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"], // <-- persist cart too
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
