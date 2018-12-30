import { combineReducers } from 'redux';
import { IBasicReducer } from '../common/reducers/BasicReducerFactory';

import Application, { AppConnectivityPayLoad } from '../actions/Application';


export type ApplicationDirectoryChangeReducer = IBasicReducer<string, string, string>;
export type ApplicationConnectivityCheckReducer = IBasicReducer<AppConnectivityPayLoad, string, string>;

export interface AppReducer {
	directory: ApplicationDirectoryChangeReducer;
	connectivity: ApplicationConnectivityCheckReducer;
}

const app = new Application();

const AppReducer = combineReducers({
	directory: app.SimpleReducer<string, string, string>('Directory'),
	connectivity: app.SimpleReducer<AppConnectivityPayLoad, string, string>('Connectivity')
});

export default AppReducer;
