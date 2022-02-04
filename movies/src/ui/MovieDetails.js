import { Accordion, AccordionDetails, AccordionSummary, Container, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getMovie, getMovieActors } from "../ducks/movies/operations";
import { getAllMovieActors, getMovieById } from "../ducks/movies/selectors";
import MovieCard from "./MovieCard";
import PersonCard from "./PersonCard";
import { getPerson, getPersonsList } from "../ducks/persons/operations";
import { getAllPersons, getPersonById, getPersonsFullNames } from "../ducks/persons/selectors";
import DirectorForm from "./DirectorForm";
import { getloadPersons } from "../ducks/flow/selectors";
import { flowActors, flowPersons } from "../ducks/flow/actions";
import * as _ from "lodash";
import ActorForm from "./ActorForm";
import { Box } from "@mui/system";

function MovieDetails({ getMovie, getPerson, getMovieActors, getPersonsList, persons, load, flowPersons, personsFullNames, flowActors }, props) {
	const location = useLocation();
	const { id } = useParams();
	const movieFromStore = useSelector((state) => getMovieById(state, id));
	const [movie, setMovie] = useState(null);
	const directorFromStore = useSelector((state) => getPersonById(state, movie ? movie.director_id : null));
	const [actorsLoad, setActorsLoad] = useState(false);
	const actors = useSelector((state) => getAllMovieActors(state, movie ? movie.id : null));

	useEffect(() => {
		if (!location.state && !movieFromStore) {
			getMovie(id);
		}
		if (movie && !directorFromStore) {
			getPerson(movie.director_id);
		}
		if (movie && !actorsLoad) {
			getMovieActors(movie.id).then((res) => {
				if (!res.error) {
					setActorsLoad(true);
					flowActors(false);
				}
			});
		}
		if (actorsLoad && !load) {
			getPersonsList().then((res) => {
				if (!res.error) flowPersons();
			});
		}
		if (location.state) setMovie(location.state);
		if (movieFromStore) setMovie(movieFromStore);
	}, [getMovie, id, location.state, movieFromStore, movie, getPerson, load, actorsLoad, getMovieActors, getPersonsList, flowPersons, flowActors]);

	const myActors =
		actors.length !== 0
			? actors.map((x) => ({
					id: x.person_id,
					movie_id: x.movie_id,
			  }))
			: [];
	const actorsToRender = _.intersectionBy(persons, myActors, "id");

	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<DirectorForm movie={movie} personsFullNames={personsFullNames} />
				</Grid>
				<Grid item xs={6}>
					<ActorForm movie={movie} persons={persons} movieActors={actors} />
				</Grid>
				<Grid item container xs={12} direction="row" spacing={2}>
					<Grid item>
						<MovieCard movie={movie} onDetails={true} disableDelete={actorsToRender.length !== 0 ? true : false} />
					</Grid>
					<Grid item>
						<PersonCard person={directorFromStore} onDetails={true} disableDelete={true} />
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Accordion sx={{ backgroundColor: "info.light" }}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
							{movie && (
								<Typography sx={{ wordBreak: "break-all" }} noWrap varaint="h3" color="white">
									{"Movie Actors:"}
								</Typography>
							)}
						</AccordionSummary>
						<AccordionDetails>
							<Grid className="mygrid" container spacing={4}>
								{actors &&
									actorsToRender.map((actor) => (
										<Grid item xs={12} md="auto" key={actor.id}>
											<PersonCard person={actor} disableDelete={true} />
										</Grid>
									))}
							</Grid>
						</AccordionDetails>
					</Accordion>
				</Grid>
			</Grid>
		</Container>
	);
}

const mapStateToProps = (state) => {
	return {
		persons: getAllPersons(state),
		load: getloadPersons(state),
		personsFullNames: getPersonsFullNames(state),
	};
};
const mapDispatchToProps = {
	getMovie,
	getPerson,
	getMovieActors,
	getPersonsList,
	flowPersons,
	flowActors,
};

export default connect(mapStateToProps, mapDispatchToProps)(MovieDetails);
