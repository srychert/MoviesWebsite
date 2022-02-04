import types from "./types";

export const flowPersons = () => ({
	type: types.ALL_PERSONS,
});

export const flowMovies = () => ({
	type: types.ALL_MOVIES,
});

export const flowActors = (value) => ({
	type: types.ALL_ACTORS,
	payload: value,
});
