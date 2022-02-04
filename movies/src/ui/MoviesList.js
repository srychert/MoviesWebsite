import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { getMoviesByGenre, searchMoviesByTitle, sortMovies } from "../ducks/movies/selectors";
import { getMoviesList } from "../ducks/movies/operations";
import { flowMovies } from "../ducks/flow/actions";
import { Container, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import MovieCard from "./MovieCard";
import { getloadMovies } from "../ducks/flow/selectors";
import * as _ from "lodash";

function MoviesList({ getMoviesList, flowMovies, load }, props) {
	const [moviesError, setMoviesError] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [sort, setSort] = useState("title-A-Z");
	const [genre, setGenre] = useState("all");
	const moviesSearched = useSelector((state) => searchMoviesByTitle(state, searchValue));
	const moviesGenre = useSelector((state) => getMoviesByGenre(state, genre, genre === "most-popular" ? true : false));
	const sortedMovies = useSelector((state) => sortMovies(state, sort));
	const movies = [sortedMovies, moviesSearched, moviesGenre];

	useEffect(() => {
		if (!load) {
			getMoviesList().then((res) => {
				if (res.error) {
					setMoviesError(true);
				} else {
					setMoviesError(false);
					flowMovies();
				}
			});
		}
	}, [getMoviesList, flowMovies, load]);

	const handleChangeSearch = (e) => {
		setSearchValue(e.target.value);
	};

	const handleChangeSort = (e) => {
		setSort(e.target.value);
	};

	const handleChangeGenre = (e) => {
		setGenre(e.target.value);
	};

	return (
		<div id="movies-list">
			{moviesError && <div>Error</div>}
			<Container>
				<Grid container sx={{ mb: 2 }}>
					<Grid item>
						<Typography variant="h5" component="h3">
							Movies list
						</Typography>
					</Grid>
				</Grid>
				<Grid className="mygrid" container spacing={4}>
					<Grid container item xs={12} spacing={4}>
						<Grid item flexBasis="332px">
							<TextField fullWidth label={"Search"} type="search" onChange={handleChangeSearch} />
						</Grid>
						<Grid item flexBasis="332px">
							<TextField fullWidth select label="Sort" value={sort} onChange={handleChangeSort}>
								<MenuItem value="title-A-Z">Title A-Z</MenuItem>
								<MenuItem value="title-Z-A">Title Z-A</MenuItem>
								<MenuItem value="genre-A-Z">Genre A-Z</MenuItem>
								<MenuItem value="genre-Z-A">Genre Z-A</MenuItem>
								<MenuItem value="date-Desc">Date Desc</MenuItem>
								<MenuItem value="date-Asc">Date Asc</MenuItem>
								<MenuItem value="genre-common">Genre Common</MenuItem>
								<MenuItem value="genre-rare">Genre Rare</MenuItem>
							</TextField>
						</Grid>
						<Grid item flexBasis="332px">
							<FormControl>
								<FormLabel id="genres">Genres</FormLabel>
								<RadioGroup aria-labelledby="genres" name="genres" row value={genre} onChange={handleChangeGenre}>
									<FormControlLabel value="all" control={<Radio />} label="All genres" />
									<FormControlLabel value="most-popular" control={<Radio />} label="The most popular genres" />
									<FormControlLabel value="least-popular" control={<Radio />} label="The least popular genres" />
								</RadioGroup>
							</FormControl>
						</Grid>
					</Grid>
					{_.intersectionBy(...movies, "id").map((movie) => (
						<Grid item xs={12} md="auto" key={movie.id}>
							<MovieCard movie={movie} disableDelete={true} />
						</Grid>
					))}
				</Grid>
			</Container>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		load: getloadMovies(state),
	};
};
const mapDispatchToProps = {
	getMoviesList,
	flowMovies,
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviesList);
