import * as path from 'path';

import { fork, join, put } from 'redux-saga/effects';

import { ConfigSchema, DataDirectory, EVMLC } from 'evm-lite-lib';

import { configurationReadWorker } from './Configuration';
import { keystoreListWorker } from './Keystore';

import Configuration from '../../actions/Configuration';
import Keystore from '../../actions/Keystore';
import Application, {
	ApplicationConnectivityPayLoad
} from '../../actions/Application';

interface DirectoryChangeInitAction {
	type: string;
	payload: string;
}

interface ConnectivityCheckInitAction {
	type: string;
	payload: ApplicationConnectivityPayLoad;
}

const app = new Application();
const config = new Configuration();
const keystore = new Keystore();

export function* dataDirectoryChangeWorker(action: DirectoryChangeInitAction) {
	const { success, failure } = app.handlers.directory;

	try {
		const directory = yield new DataDirectory(action.payload);

		const configurationForkData: ConfigSchema = yield join(
			yield fork(
				configurationReadWorker,
				config.handlers.load.init({
					path: path.join(directory.path, 'config.toml')
				})
			)
		);

		yield put(success('Data Directory change successful.'));

		if (configurationForkData) {
			yield join(
				yield fork(
					keystoreListWorker,
					keystore.handlers.list.init({
						path: configurationForkData.storage.keystore
					})
				)
			);
		}
	} catch (e) {
		yield put(failure('Error: ' + e));
	}
}

export function* checkConnectivityWorker(action: ConnectivityCheckInitAction) {
	const { success, failure } = app.handlers.connectivity;

	try {
		const connection: EVMLC = new EVMLC(
			action.payload.host,
			action.payload.port,
			{
				from: '',
				gas: 0,
				gasPrice: 0
			}
		);

		const result: boolean = yield connection.testConnection();

		if (result) {
			yield put(success('A connection to a node was established.'));

			return connection;
		}
	} catch (e) {
		yield put(failure('Error: ' + e));
		// yield put(reset());

		return null;
	}
}
