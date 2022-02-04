import thunk from "redux-thunk";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import logger from "redux-logger";
import { createMiddleware } from "redux-api-middleware";
import { entities } from "./entities/reducers";
import { flowReducer } from "./flow/reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
	entities: entities,
	flow: flowReducer,
});

const store = createStore(combinedReducers, composeEnhancers(applyMiddleware(thunk, createMiddleware(), logger)));

export default store;
