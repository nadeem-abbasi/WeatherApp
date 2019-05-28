import { SAVE } from './actionTypes';
import { combineReducers } from 'redux';

const savePreferences = (state = { unit: 'imperial' }, action) => {
	switch (action.type) {
		case SAVE:
			return {
				...state,
				unit: action.unit
			};

		default:
			return state;
	}
};

const rootReducer = combineReducers({
	savePreferences
});

export default rootReducer;
