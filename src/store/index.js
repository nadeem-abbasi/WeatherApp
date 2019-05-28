import { createStore } from 'redux';
import rootReducer from './reducer';
import { loadState, saveState } from './localStorage';

const persistedState = loadState();

const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
	saveState(store.getState());
});

export default store;
