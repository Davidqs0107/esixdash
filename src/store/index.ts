/* eslint-disable import/prefer-default-export */
import { applyMiddleware, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import RootReducer from "../reducers";

const { ENABLE_REDUX_LOGGER } = process.env;

const loggerMiddleware = createLogger();

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["auth"],
  whitelist: [""],
};

const persistedReducer = persistReducer<any, any>(persistConfig, RootReducer);

export function configureStore(preloadedState = {}) {
  const middlewares = [thunkMiddleware];

  if (ENABLE_REDUX_LOGGER) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    middlewares.push(loggerMiddleware);
  }

  const middlewareEnhancer = composeWithDevTools(
    applyMiddleware(...middlewares)
  );

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const store = createStore(
    persistedReducer,
    preloadedState,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    composedEnhancers
  );

  return store;
}

export const store = configureStore();
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// export type ThunkAction<
//   R, // Return type of the thunk function
//   S, // state type used by getState
//   E, // any "extra argument" injected into the thunk
//   A extends Action // known types of actions that can be dispatched
// > = (
//   dispatch: ThunkDispatch<S, E, A>,
//   getState: () => S,
//   extraArgument: E
// ) => R;
