import * as _ from "lodash";

export const getAllActors = (state) => {
	return state.entities.actors.allIds.map((id) => state.entities.actors.byId[id]);
};

export const getActorsWithMostMovies = (state) => {
	let allActors = getAllActors(state);
	let actorsByPersonsId = allActors.reduce((prev, curr) => {
		prev[curr.person_id] = prev[curr.person_id] ? [...prev[curr.person_id], curr] : [curr];
		return prev;
	}, []);

	let count = allActors.reduce((prev, curr) => {
		prev[curr.person_id] = prev[curr.person_id] ? prev[curr.person_id] + 1 : 1;
		return prev;
	}, {});

	let actorsWithMostMovies = [];
	let maxValue = _.max(Object.values(count));
	for (const [key, value] of Object.entries(count)) {
		if (value === maxValue) actorsWithMostMovies.push(actorsByPersonsId[key][0]);
	}
	return actorsWithMostMovies;
};
