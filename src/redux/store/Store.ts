import logger from 'redux-logger';
import dynamicStorage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import ApplicationSagas from '../sagas/watchers/Application';
import ConfigurationSagas from '../sagas/watchers/Configuration';
import KeystoreSagas from '../sagas/watchers/Keystore';
import TransactionSagas from '../sagas/watchers/Transactions';
import AccountSagas from '../sagas/watchers/Accounts';

import ConfigRootReducer, { ConfigReducer } from '../reducers/Configuration';
import AppRootReducer, { AppReducer } from '../reducers/Application';
import KeystoreRootReducer, { KeystoreReducer } from '../reducers/Keystore';
import TransactionsRootReducer, {
	ITransactionsReducer
} from '../reducers/Transactions';
import AccountsRootReducer, { IAccountsReducer } from '../reducers/Accounts';

export interface Store {
	accounts: IAccountsReducer;
	keystore: KeystoreReducer;
	config: ConfigReducer;
	app: AppReducer;
	transactions: ITransactionsReducer;
}

const persistConfig: PersistConfig = {
	key: 'root',
	storage: dynamicStorage,
	whitelist: ['app']
};

const rootReducer = combineReducers({
	accounts: AccountsRootReducer,
	keystore: KeystoreRootReducer,
	config: ConfigRootReducer,
	app: AppRootReducer,
	transactions: TransactionsRootReducer
});

const saga = createSagaMiddleware();
const middleware = [saga, logger];
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
	const store = createStore(persistedReducer, applyMiddleware(...middleware));
	const persistor = persistStore(store);

	saga.run(ApplicationSagas);
	saga.run(ConfigurationSagas);
	saga.run(KeystoreSagas);
	saga.run(TransactionSagas);
	saga.run(AccountSagas);

	return { store, persistor };
};
