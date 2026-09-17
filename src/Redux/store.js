import { legacy_createStore as createStore} from "redux";
import reducers from "./reducers";
// This is a browser app, not React Native — @react-native-async-storage
// pulled in the entire react-native package as a transitive dependency
// (and conflicted with this app's React 18), so it's replaced here with
// redux-persist's own web storage engine (localStorage). Same persisted
// keys/shape, so existing logged-in sessions aren't affected.
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';



const persistConfig = {
    key: 'root',
    storage,
  }

const persistedReducer = persistReducer(persistConfig, reducers)

let store = createStore(persistedReducer)
export const persistor = persistStore(store)

export default store;