import { Container, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
import { connect, useSelector } from "react-redux";
import { flowPersons } from "../ducks/flow/actions";
import { getloadPersons } from "../ducks/flow/selectors";
import { getPersonsList, deletePerson } from "../ducks/persons/operations";
import { getPersonsByNationality, searchPersonsByName, sortPersons } from "../ducks/persons/selectors";
import PersonCard from "./PersonCard";
import * as _ from "lodash";

const PersonsList = ({ getPersonsList, flowPersons, load }, props) => {
	const [personsError, setPersonsError] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [sort, setSort] = useState("name-A-Z");
	const [nationality, setNationality] = useState("all");
	const personsSearched = useSelector((state) => searchPersonsByName(state, searchValue));
	const sortedPersons = useSelector((state) => sortPersons(state, sort));
	const personsNationality = useSelector((state) => getPersonsByNationality(state, nationality, nationality === "most-common" ? true : false));
	const persons = [sortedPersons, personsSearched, personsNationality];

	// const { t } = useTranslation();
	useEffect(() => {
		if (!load) {
			getPersonsList().then((res) => {
				if (res.error) {
					setPersonsError(true);
				} else {
					setPersonsError(false);
					flowPersons();
				}
			});
		}
	}, [getPersonsList, flowPersons, load]);

	const handleChangeSearch = (e) => {
		setSearchValue(e.target.value);
	};

	const handleChangeSort = (e) => {
		setSort(e.target.value);
	};

	const handleChangeNationality = (e) => {
		setNationality(e.target.value);
	};

	return (
		<div id="persons-list">
			{personsError && <div>Error</div>}
			<Container>
				<Grid sx={{ mb: 2 }}>
					<Grid item>
						<Typography variant="h5" component="h3">
							Persons list
						</Typography>
					</Grid>
				</Grid>
				<Grid className="mygrid" container spacing={3}>
					<Grid container item xs={12} spacing={3}>
						<Grid item flexBasis="332px">
							<TextField fullWidth label={"Search"} type="search" onChange={handleChangeSearch} />
						</Grid>
						<Grid item flexBasis="332px">
							<TextField fullWidth select label="Sort" value={sort} onChange={handleChangeSort}>
								<MenuItem value="name-A-Z">Name A-Z</MenuItem>
								<MenuItem value="name-Z-A">Name Z-A</MenuItem>
								<MenuItem value="nationality-A-Z">Nationality A-Z</MenuItem>
								<MenuItem value="nationality-Z-A">Nationality Z-A</MenuItem>
								<MenuItem value="date-Desc">Birth Date Desc</MenuItem>
								<MenuItem value="date-Asc">Birth Date Asc</MenuItem>
								<MenuItem value="nationality-common">Nationality Common</MenuItem>
								<MenuItem value="nationality-rare">Nationality Rare</MenuItem>
							</TextField>
						</Grid>

						<Grid item flexBasis="332px">
							<FormControl>
								<FormLabel id="nationality">Nationality</FormLabel>
								<RadioGroup aria-labelledby="nationality" name="nationality" row value={nationality} onChange={handleChangeNationality}>
									<FormControlLabel value="all" control={<Radio />} label="All nationalities" />
									<FormControlLabel value="most-common" control={<Radio />} label="The most common nationalities" />
									<FormControlLabel value="least-common" control={<Radio />} label="The least common nationalities" />
								</RadioGroup>
							</FormControl>
						</Grid>
					</Grid>
					{_.intersectionBy(...persons, "id").map((person) => (
						<Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={person.id}>
							<PersonCard person={person} disableDelete={true} />
						</Grid>
					))}
				</Grid>
			</Container>
		</div>
	);
};
const mapStateToProps = (state) => {
	return {
		load: getloadPersons(state),
	};
};
const mapDispatchToProps = {
	getPersonsList,
	deletePerson,
	flowPersons,
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonsList);
