import { Accordion, AccordionDetails, AccordionSummary, Container, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getPerson } from "../ducks/persons/operations";
import { getPersonById } from "../ducks/persons/selectors";
import PersonCard from "./PersonCard";
import { getAllMovies, getMoviesDirectedByPerson } from "../ducks/movies/selectors";
import { getMoviesList } from "../ducks/movies/operations";
import { flowActors, flowMovies } from "../ducks/flow/actions";
import MovieCard from "./MovieCard";
import { getloadActors, getloadMovies } from "../ducks/flow/selectors";
import { getActorsList } from "../ducks/actors/operations";
import { getAllActors } from "../ducks/actors/selectors";
import * as _ from "lodash";

function PersonDetails({ movies, getPerson, getMoviesList, flowMovies, load, getActorsList, actors, flowActors, loadActors }, props) {
	const location = useLocation();
	const { id } = useParams();
	const personFromStore = useSelector((state) => getPersonById(state, id));
	const moviesDirectedByPerson = useSelector((state) => getMoviesDirectedByPerson(state, parseInt(id)));
	const [person, setPerson] = useState(null);
	const [disableDelete, setDisableDelete] = useState(true);

	useEffect(() => {
		if (!location.state && !personFromStore) {
			getPerson(id);
		}
		if (!load && [personFromStore || location.state]) {
			getMoviesList().then((res) => {
				if (res.error) {
				} else {
					flowMovies();
					if (!loadActors) {
						getActorsList().then((res) => {
							if (res.error) {
							} else {
								flowActors(true);
							}
						});
					}
				}
			});
		}

		moviesDirectedByPerson.length > 0 ? setDisableDelete(true) : setDisableDelete(false);
		if (location.state) setPerson(location.state);
		if (personFromStore) setPerson(personFromStore);
	}, [getPerson, id, location.state, personFromStore, flowMovies, getMoviesList, load, moviesDirectedByPerson.length, flowActors, getActorsList, loadActors]);

	const disableIfActor = actors.filter((actor) => actor.person_id === id).length !== 0 ? true : false;
	const actorsMaped = actors.map((actor) => ({
		...actor,
		id: actor.movie_id,
	}));
	const moviesPersonPlayedIn = _.intersectionBy(movies, actorsMaped, "id");

	return (
		<Container>
			<Grid container>
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
					<PersonCard person={person} onDetails={true} maxWidth={300} disableDelete={disableDelete || disableIfActor} />
				</Grid>
				<Grid item xs={12}>
					<Accordion sx={{ backgroundColor: "info.light" }}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
							{person && (
								<div style={{ maxWidth: "40vw" }}>
									<Typography sx={{ wordBreak: "break-all" }} noWrap varaint="h3" color="white">
										{"Movies directed by " + person.first_name + " " + person.last_name}
									</Typography>
								</div>
							)}
						</AccordionSummary>
						<AccordionDetails>
							<Grid className="mygrid" container spacing={4}>
								{moviesDirectedByPerson.map((movie) => (
									<Grid item xs={12} md="auto" key={movie.id}>
										<MovieCard movie={movie} disableDelete={true} />
									</Grid>
								))}
							</Grid>
						</AccordionDetails>
					</Accordion>
				</Grid>
				<Grid item xs={12}>
					<Accordion sx={{ backgroundColor: "success.light" }}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
							{person && (
								<div style={{ maxWidth: "40vw" }}>
									<Typography sx={{ wordBreak: "break-all" }} noWrap varaint="h3" color="white">
										{"Movies person played in "}
									</Typography>
								</div>
							)}
						</AccordionSummary>
						<AccordionDetails>
							<Grid className="mygrid" container spacing={4}>
								{moviesPersonPlayedIn.map((movie) => (
									<Grid item xs={12} md="auto" key={movie.id}>
										<MovieCard movie={movie} disableDelete={true} />
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
		load: getloadMovies(state),
		actors: getAllActors(state),
		loadActors: getloadActors(state),
		movies: getAllMovies(state),
	};
};
const mapDispatchToProps = {
	getPerson,
	getMoviesList,
	flowMovies,
	getMoviesDirectedByPerson,
	getActorsList,
	flowActors,
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetails);
