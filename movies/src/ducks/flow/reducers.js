import types from "./types";

const defaultState = {
	get_all_persons: false,
	get_all_movies: false,
	get_all_actors: false,
};

export const flowReducer = (state = defaultState, action) => {
	switch (action.type) {
		case types.ALL_PERSONS:
			return { ...state, get_all_persons: true };
		case types.ALL_MOVIES:
			return { ...state, get_all_movies: true };
		case types.ALL_ACTORS:
			return { ...state, get_all_actors: action.payload };
		default:
			return state;
	}
};
