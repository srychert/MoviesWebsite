import { createAction } from "redux-api-middleware";
import types from "./types";
import { schema, normalize } from "normalizr";

const actorSchema = new schema.Entity("actors");
const actorsSchema = [actorSchema];

export const getActorsList = () => {
	return createAction({
		endpoint: "http://localhost:5000/api/actors",
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		types: [
			types.ACTOR_LIST_REQUEST,
			{
				type: types.ACTOR_LIST_SUCCESS,
				payload: async (action, state, res) => {
					// console.log("PAYLOAD", action, state, res);
					const json = await res.json();
					const { entities } = normalize(json, actorsSchema);
					return entities;
				},
				meta: { actionType: "GET_ALL" },
			},
			types.ACTOR_LIST_FAILURE,
		],
	});
};
