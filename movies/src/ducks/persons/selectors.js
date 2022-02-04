import * as _ from "lodash";

export const getAllPersons = (state) => {
	return state.entities.persons.allIds.map((id) => state.entities.persons.byId[id]);
};

export const getPersonById = (state, personId) => {
	return state.entities.persons.byId[personId];
};

export const getPersonsFullNames = (state) => {
	return state.entities.persons.allIds.map((id) => {
		let person = state.entities.persons.byId[id];
		let personFullName = "";

		for (const [key, value] of Object.entries(person)) {
			if (key === "first_name") personFullName += value;
			if (key === "last_name") personFullName += " " + value;
		}
		return { id: person.id, name: personFullName };
	});
};

export const sortPersons = (state, sortValue) => {
	let allPersons = getAllPersons(state);
	let personsByNationality = allPersons.reduce((prev, curr) => {
		prev[curr.nationality] = prev[curr.nationality] ? [...prev[curr.nationality], curr] : [curr];
		return prev;
	}, []);

	let persons = [];
	// eslint-disable-next-line no-unused-vars
	for (const [key, value] of Object.entries(personsByNationality)) {
		persons.push(value);
	}

	switch (sortValue) {
		case "name-A-Z":
			return allPersons.sort((a, b) => a.first_name.localeCompare(b.first_name));
		case "name-Z-A":
			return allPersons.sort((a, b) => b.first_name.localeCompare(a.first_name));
		case "nationality-A-Z":
			return allPersons.sort((a, b) => a.first_name.localeCompare(b.first_name));
		case "nationality-Z-A":
			return allPersons.sort((a, b) => b.nationality.localeCompare(a.nationality));
		case "date-Desc":
			return allPersons.sort((a, b) => (new Date(a.birth_date) > new Date(b.birth_date) ? -1 : 1));
		case "date-Asc":
			return allPersons.sort((a, b) => (new Date(a.birth_date) > new Date(b.birth_date) ? 1 : -1));
		case "nationality-common":
			return persons.sort((a, b) => (a.length > b.length ? -1 : 1)).flat();
		case "nationality-rare":
			return persons.sort((a, b) => (a.length > b.length ? 1 : -1)).flat();
		default:
			return allPersons;
	}
};

export const searchPersonsByName = (state, name) => {
	return getAllPersons(state).filter((person) => {
		let person_name = person.first_name + " " + person.last_name;
		return person_name.toLowerCase().includes(name.toLowerCase());
	});
};

export const getPersonsByNationality = (state, nationality, max) => {
	let allPersons = getAllPersons(state);
	let personsByNationality = allPersons.reduce((prev, curr) => {
		prev[curr.nationality] = prev[curr.nationality] ? [...prev[curr.nationality], curr] : [curr];
		return prev;
	}, []);

	let count = allPersons.reduce((prev, curr) => {
		prev[curr.nationality] = prev[curr.nationality] ? prev[curr.nationality] + 1 : 1;
		return prev;
	}, {});

	// max === true -> most-common; max === false -> least-common
	let choiceCount = max ? _.max(Object.values(count)) : _.min(Object.values(count));
	let choice = [];
	for (const [key, value] of Object.entries(count)) {
		if (value === choiceCount) choice.push(key);
	}

	let persons = choice.map((nat) => personsByNationality[nat]);

	switch (nationality) {
		case "all":
			return allPersons;
		case "most-common":
			return persons.flat();
		case "least-common":
			return persons.flat();
		default:
			return personsByNationality[nationality] ? personsByNationality[nationality] : personsByNationality;
	}
};
