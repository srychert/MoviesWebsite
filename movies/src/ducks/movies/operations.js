import { createAction } from "redux-api-middleware";
import types from "./types";
import { schema, normalize } from "normalizr";

const movieSchema = new schema.Entity("movies");
const moviesSchema = [movieSchema];
const movieActorSchema = new schema.Entity("actors");
const movieActorsSchema = [movieActorSchema];

export const createMovie = (newMovie) => {
	return createAction({
		endpoint: "http://localhost:5000/api/movies",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newMovie),
		types: [
			types.MOVIE_CREATE_REQUEST,
			{
				type: types.MOVIE_CREATE_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const json = await res.json();
					const { entities } = normalize(json, movieSchema);
					return entities;
				},
				meta: { actionType: "ADD" },
			},
			{
				type: types.MOVIE_CREATE_FAILURE,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", res);
					let errormsg = ""
					await res.body.getReader().read().then(({done, value})=> {
						let string = new TextDecoder().decode(value);
						errormsg = string
					})
					// console.log(errormsg)
					return errormsg
				},
				meta: null,
			},
			// types.MOVIE_CREATE_FAILURE,
		],
	});
};

export const getMoviesList = () => {
	return createAction({
		endpoint: "http://localhost:5000/api/movies",
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		types: [
			types.MOVIE_LIST_REQUEST,
			{
				type: types.MOVIE_LIST_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const json = await res.json();
					const { entities } = normalize(json, moviesSchema);
					return entities;
				},
				meta: { actionType: "GET_ALL" },
			},
			types.MOVIE_LIST_FAILURE,
		],
	});
};

export const getMovie = (movieId) => {
	return createAction({
		endpoint: `http://localhost:5000/api/movies/${movieId}`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		types: [
			types.MOVIE_GET_REQUEST,
			{
				type: types.MOVIE_GET_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const json = await res.json();
					const { entities } = normalize(json, movieSchema);
					return entities;
				},
				meta: { actionType: "ADD" },
			},
			types.MOVIE_GET_FAILURE,
		],
	});
};

export const editMovie = (movieToEdit) => {
	return createAction({
		endpoint: `http://localhost:5000/api/movies/${movieToEdit.id}`,
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(movieToEdit),
		types: [
			types.MOVIE_EDIT_REQUEST,
			{
				type: types.MOVIE_EDIT_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const json = await res.json();
					const { director, ...rest } = json;
					const newMovie = { id: movieToEdit.id, director_id: movieToEdit.director_id, ...rest };
					const { entities } = normalize(newMovie, movieSchema);
					return entities;
				},
				meta: { actionType: "EDIT" },
			},
			types.MOVIE_EDIT_FAILURE,
		],
	});
};

export const deleteMovie = (movieToDelete) => {
	return createAction({
		endpoint: `http://localhost:5000/api/movies/${movieToDelete.id}`,
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		types: [
			types.MOVIE_DELETE_REQUEST,
			{
				type: types.MOVIE_DELETE_SUCCESS,
				payload: async (action, state, res) => {
					const { entities } = normalize(movieToDelete, movieSchema);
					return entities;
				},
				meta: { actionType: "DELETE" },
			},
			types.MOVIE_DELETE_FAILURE,
		],
	});
};

export const patchMovieDirector = (movieToEdit, director_id) => {
	const request_body = director_id === null ? {} : { id: director_id };
	return createAction({
		endpoint: `http://localhost:5000/api/movies/${movieToEdit.id}/director`,
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request_body),
		types: [
			types.MOVIE_PATCH_DIRECTOR_REQUEST,
			{
				type: types.MOVIE_PATCH_DIRECTOR_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const { entities } = normalize({ ...movieToEdit, director_id: director_id }, movieSchema);
					return entities;
				},
				meta: { actionType: "EDIT" },
			},
			types.MOVIE_PATCH_DIRECTOR_FAILURE,
		],
	});
};

export const getMovieActors = (movieId) => {
	return createAction({
		endpoint: `http://localhost:5000/api/movies/${movieId}/actors`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		types: [
			types.MOVIE_GET_ACTORS_REQUEST,
			{
				type: types.MOVIE_GET_ACTORS_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const json = await res.json();
					const { entities } = normalize(json, movieActorsSchema);
					return entities;
				},
				meta: { actionType: "GET_ALL" },
			},
			types.MOVIE_GET_ACTORS_FAILURE,
		],
	});
};

export const addActor = (movieToEdit, actor_id) => {
	const request_body = actor_id === null ? {} : { id: actor_id };
	return createAction({
		endpoint: `http://localhost:5000/api/movies/${movieToEdit.id}/actors`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request_body),
		types: [
			types.MOVIE_ADD_ACTOR_REQUEST,
			{
				type: types.MOVIE_ADD_ACTOR_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const json = await res.json();
					const { entities } = normalize(json, movieActorSchema);
					return entities;
				},
				meta: { actionType: "ADD" },
			},
			types.MOVIE_ADD_ACTOR_FAILURE,
		],
	});
};
