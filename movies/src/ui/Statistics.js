import { Container, Grid, Typography } from "@mui/material";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { getActorsList } from "../ducks/actors/operations";
import { getAllActors, getActorsWithMostMovies } from "../ducks/actors/selectors";
import { flowActors, flowPersons } from "../ducks/flow/actions";
import { getloadActors, getloadPersons } from "../ducks/flow/selectors";
import { getAllPersons } from "../ducks/persons/selectors";
import { getPersonsList } from "../ducks/persons/operations";
import * as _ from "lodash";
import PersonCard from "./PersonCard";

function Statistics({ getActorsList, actors, loadActors, flowActors, actorsWithMostMovies, loadPersons, getPersonsList, persons }) {
	useEffect(() => {
		if (!loadActors) {
			getActorsList();
			flowActors(true);
			getPersonsList();
			flowPersons();
		}
	}, [flowActors, getActorsList, loadActors, loadPersons, getPersonsList]);
	const actorsPersonsIds = actorsWithMostMovies.map((x) => ({ id: x.person_id }));
	const actorsWithMostMoviesMaped = _.intersectionBy(persons, actorsPersonsIds, "id");
	return (
		<Container>
			<Grid container sx={{ mb: 2 }}>
				<Grid item xs={12}>
					<Typography variant="h5" component="h3">
						Statistics
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h5" component="h3">
						Actors with most movies:
					</Typography>
				</Grid>
				<Grid container spacing={3}>
					{actorsWithMostMoviesMaped.map((person) => (
						<Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={person.id}>
							<PersonCard person={person} disableDelete={true} />
						</Grid>
					))}
				</Grid>
			</Grid>
		</Container>
	);
}

const mapStateToProps = (state) => {
	return {
		actors: getAllActors(state),
		loadActors: getloadActors(state),
		actorsWithMostMovies: getActorsWithMostMovies(state),
		persons: getAllPersons(state),
		loadPersons: getloadPersons(state),
	};
};
const mapDispatchToProps = {
	getActorsList,
	flowActors,
	getPersonsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
