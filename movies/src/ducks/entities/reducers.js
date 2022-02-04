import * as _ from "lodash";

const allEntities = ["persons", "movies", "actors"];

const defaultState = allEntities.reduce(
	(acc, entity) => ({
		...acc,
		[entity]: {
			byId: {},
			allIds: [],
		},
	}),
	{}
);

const entityReducer = (entity, state = { allIds: [], byId: {} }, action) => {
	// console.log("Before", entity, state, action);
	const actionEntities = action.payload[entity];
	// console.log("Entity", actionEntities);
	const { actionType } = action.meta;
	const keys = Object.keys(actionEntities);

	switch (actionType) {
		case "GET_ALL":
			return {
				byId: {
					...keys.reduce(
						(acc, id) => ({
							...acc,
							[id]: {
								...state.byId[id],
								...actionEntities[id],
							},
						}),
						{}
					),
				},
				allIds: keys,
			};
		case "DELETE":
			return {
				byId: _.omit(state.byId, keys),
				allIds: state.allIds.filter((id) => !keys.includes(id)),
			};
		case "ADD":
			return {
				byId: { ...state.byId, ...actionEntities },
				allIds: [...state.allIds, ...keys],
			};
		case "EDIT":
			return {
				byId: { ...state.byId, ...actionEntities },
				allIds: [...state.allIds],
			};
		default:
			return state;
	}
};

export const entities = (state = defaultState, action) => {
	if (!action.meta || !action.meta.actionType) return state;

	return {
		...state,
		...Object.keys(action.payload).reduce(
			(acc, entity) => ({
				...acc,
				[entity]: entityReducer(entity, state[entity], action),
			}),
			{}
		),
	};
};
