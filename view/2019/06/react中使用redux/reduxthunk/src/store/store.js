import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';

import aReducer from './A/aReducer';

let store = createStore(
    combineReducers({
        aReducer
    }),
    applyMiddleware(thunk)
);

export default store;