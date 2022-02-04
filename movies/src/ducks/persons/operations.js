import { createAction } from "redux-api-middleware";
import types from "./types";
import { schema, normalize } from "normalizr";

const personSchema = new schema.Entity("persons");
const personsSchema = [personSchema];

export const createPerson = (newPerson) => {
	return createAction({
		endpoint: "http://localhost:5000/api/persons",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newPerson),
		types: [
			types.PERSON_CREATE_REQUEST,
			{
				type: types.PERSON_CREATE_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const json = await res.json();
					const { entities } = normalize(json, personSchema);
					return entities;
				},
				meta: { actionType: "ADD" },
			},
			types.PERSON_CREATE_FAILURE,
		],
	});
};

export const getPersonsList = () => {
	return createAction({
		endpoint: "http://localhost:5000/api/persons",
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		types: [
			types.PERSON_LIST_REQUEST,
			{
				type: types.PERSON_LIST_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const json = await res.json();
					const { entities } = normalize(json, personsSchema);
					return entities;
				},
				meta: { actionType: "GET_ALL" },
			},
			types.PERSON_LIST_FAILURE,
		],
	});
};

export const getPerson = (personId) => {
	return createAction({
		endpoint: `http://localhost:5000/api/persons/${personId}`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		types: [
			types.PERSON_GET_REQUEST,
			{
				type: types.PERSON_GET_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const json = await res.json();
					const { entities } = normalize(json, personSchema);
					return entities;
				},
				meta: { actionType: "ADD" },
			},
			types.PERSON_GET_FAILURE,
		],
	});
};

export const editPerson = (personToEdit) => {
	console.log(personToEdit);
	return createAction({
		endpoint: `http://localhost:5000/api/persons/${personToEdit.id}`,
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(personToEdit),
		types: [
			types.PERSON_EDIT_REQUEST,
			{
				type: types.PERSON_EDIT_SUCCESS,
				payload: async (action, state, res) => {
					const json = await res.json();
					const newPerson = { id: personToEdit.id, ...json };
					const { entities } = normalize(newPerson, personSchema);
					return entities;
				},
				meta: { actionType: "EDIT" },
			},
			types.PERSON_EDIT_FAILURE,
		],
	});
};

export const deletePerson = (personToDelete) => {
	return createAction({
		endpoint: `http://localhost:5000/api/persons/${personToDelete.id}`,
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		types: [
			types.PERSON_DELETE_REQUEST,
			{
				type: types.PERSON_DELETE_SUCCESS,
				payload: async (action, state, res) => {
					const { entities } = normalize(personToDelete, personSchema);
					return entities;
				},
				meta: { actionType: "DELETE" },
			},
			types.PERSON_DELETE_FAILURE,
		],
	});
};
