import * as _ from "lodash";

export const getAllMovies = (state) => {
	return state.entities.movies.allIds.map((id) => state.entities.movies.byId[id]);
};

export const getMovieById = (state, movieId) => {
	return state.entities.movies.byId[movieId];
};

export const getMoviesDirectedByPerson = (state, personId) => {
	return getAllMovies(state).filter((movie) => movie.director_id === personId);
};

export const getAllMovieActors = (state, movie_id) => {
	let actors = state.entities.actors.allIds.map((id) => (state.entities.actors.byId[id].movie_id === movie_id ? state.entities.actors.byId[id] : null));
	return actors.filter((x) => x !== null);
};

export const sortMovies = (state, sortValue) => {
	let allMovies = getAllMovies(state);
	let moviesByGenre = allMovies.reduce((prev, curr) => {
		prev[curr.genre] = prev[curr.genre] ? [...prev[curr.genre], curr] : [curr];
		return prev;
	}, []);

	let movies = [];
	// eslint-disable-next-line no-unused-vars
	for (const [key, value] of Object.entries(moviesByGenre)) {
		movies.push(value);
	}

	switch (sortValue) {
		case "title-A-Z":
			return allMovies.sort((a, b) => a.title.localeCompare(b.title));
		case "title-Z-A":
			return allMovies.sort((a, b) => b.title.localeCompare(a.title));
		case "genre-A-Z":
			return allMovies.sort((a, b) => a.genre.localeCompare(b.genre));
		case "genre-Z-A":
			return allMovies.sort((a, b) => b.genre.localeCompare(a.genre));
		case "date-Desc":
			return allMovies.sort((a, b) => (new Date(a.release_date) > new Date(b.release_date) ? -1 : 1));
		case "date-Asc":
			return allMovies.sort((a, b) => (new Date(a.release_date) > new Date(b.release_date) ? 1 : -1));
		case "genre-common":
			return movies.sort((a, b) => (a.length > b.length ? -1 : 1)).flat();
		case "genre-rare":
			return movies.sort((a, b) => (a.length > b.length ? 1 : -1)).flat();
		default:
			return allMovies;
	}
};

export const searchMoviesByTitle = (state, title) => {
	return getAllMovies(state).filter((movie) => movie.title.toLowerCase().includes(title.toLowerCase()));
};

export const getMoviesByGenre = (state, genre, max) => {
	let allMovies = getAllMovies(state);
	let moviesByGenre = allMovies.reduce((prev, curr) => {
		prev[curr.genre] = prev[curr.genre] ? [...prev[curr.genre], curr] : [curr];
		return prev;
	}, []);

	let count = allMovies.reduce((prev, curr) => {
		prev[curr.genre] = prev[curr.genre] ? prev[curr.genre] + 1 : 1;
		return prev;
	}, {});

	let choiceCount = max ? _.max(Object.values(count)) : _.min(Object.values(count));
	let choice = [];
	for (const [key, value] of Object.entries(count)) {
		if (value === choiceCount) choice.push(key);
	}

	let movies = choice.map((gen) => moviesByGenre[gen]);

	switch (genre) {
		case "all":
			return allMovies;
		case "most-popular":
			return movies.flat();
		case "least-popular":
			return movies.flat();
		default:
			return moviesByGenre[genre] ? moviesByGenre[genre] : moviesByGenre;
	}
};
