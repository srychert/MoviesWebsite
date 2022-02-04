import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
// import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createMovie, editMovie } from "../ducks/movies/operations";
import { getPersonsList } from "../ducks/persons/operations";
import { getAllPersons, getPersonsFullNames } from "../ducks/persons/selectors";
import { flowPersons } from "../ducks/flow/actions";
import MySelect from "./FormComponents/MySelect";
import MyInput from "./FormComponents/MyInput";
import SubmitButton from "./FormComponents/SubmitButton";
import { Container, Grid } from "@mui/material";
import ErrorDialog from "./FormComponents/ErrorDialog";
import MyDate from "./FormComponents/MyDate";
import * as _ from "lodash";

function MovieForm({ createMovie, editMovie, getPersonsList, persons, flowPersons, load, personsFullNames }, props) {
	const navigate = useNavigate();
	// const { t } = useTranslation();
	const location = useLocation();
	const { id, director_id, first_name, last_name, ...movieToEdit } = location.state ? location.state : {};
	const [open, setOpen] = useState(false);
	const [msg, setMsg] = useState("");



	useEffect(() => {
		if (!load) {
			getPersonsList().then((res) => {
				if (!res.error) {flowPersons()}
			});
		}
	}, [flowPersons, getPersonsList, load]);

	const handleSubmit = (values, setStatus, setSubmitting) => {
		const operations = [createMovie, editMovie];

		operations[id ? 1 : 0]({ id: id, director_id: values.director, ...values, director: { id: values.director } }).then((res) => {
			if (res.error) {
				console.log(res);
				setMsg(_.capitalize(res.payload.replace("_", " ")))
				handleOpen();
				setStatus({
					sent: false,
					msg: res.message,
				});
			} else {
				handleClose();
				setStatus({
					sent: true,
					msg: "Success",
				});
			}
			setTimeout(() => {
				setSubmitting(false);
				id && navigate("/movies");
			}, 500);
		});
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const genres = ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Thriller", "Western"].map((x) => {
		return { id: x, name: x };
	});

	const size = {
		xs: 12,
		sm: 6,
		md: 4,
		lg: 3,
		xl: 2,
	};

	return (
		<Container>
			<Formik
				initialValues={
					Object.keys(movieToEdit).length !== 0
						? {
								title: movieToEdit.title,
								genre: movieToEdit.genre,
								release_date: movieToEdit.release_date.split("T")[0],
								description: movieToEdit.description,
								image_url: movieToEdit.image_url,
								director: director_id,
						  }
						: {
								title: "",
								genre: genres[0].id,
								release_date: "",
								description: "",
								image_url: "",
								director: persons[0] ? persons[0].id : null,
						  }
				}
				validate={(values) => {
					const errors = {};
					const maxLength = 220;
					const messages = {
						title: "Title required",
						title_length: `Title too long max ${maxLength} characters`,
						genre: "Genre required",
						release_date: "Release date required",
						description: "Description required",
						image_url: "Image URL required",
						director: "Director required",
						incorrect_url: "Incorrect URL",
						release_date_from_future: "Release date can't be from future",
					};

					const validationRequierd = (key, value) => {
						if (!value) {
							errors[key] = messages[key];
						}
					};

					const validationLength = (key, value) => {
						if (value.length > maxLength) {
							errors[key] = messages[key + "_length"];
						}
					};

					function validateImageURL(image_url) {
						function testUrl(url) {
							try {
								new URL(url);
							} catch (e) {
								return false;
							}
							return true;
						}

						if (!testUrl(image_url)) {
							errors.image_url = messages.incorrect_url;
						}
					}

					const validateRelaseDate = (release_date) => {
						if (new Date(release_date).setHours(0, 0, 0, 0) > new Date()) {
							errors.release_date = messages.release_date_from_future;
						}
					};

					const validateDirector = (director) => {
						if (director === null && director === "") {
							errors.director = messages.director;
						}
					};

					for (const [key, value] of Object.entries(values)) {
						validationRequierd(key, value);
					}

					validateDirector(values.director);
					validationLength("title", values.title);
					validateRelaseDate(values.release_date);
					validateImageURL(values.image_url);

					return errors;
				}}
				onSubmit={(values, { setStatus, setSubmitting }) => handleSubmit(values, setStatus, setSubmitting)}
				enableReinitialize={true}
			>
				{({ isSubmitting, status }) => (
					<Form>
						<Grid container spacing={2}>
							<Grid item xs={size.xs} sm={size.sm} md={size.md} lg={size.lg} xl={size.xl}>
								<Field name="title" placeholder="title" component={MyInput} />
							</Grid>
							<Grid item xs={size.xs} sm={size.sm} md={size.md} lg={size.lg} xl={size.xl}>
								<Field name="genre" as="select" component={MySelect} items={genres} labelText="Genre" />
							</Grid>
							<Grid item xs={size.xs} sm={size.sm} md={size.md} lg={size.lg} xl={size.xl}>
								<Field name="release_date" type="date" component={MyDate} />
							</Grid>
							<Grid item xs={size.xs} sm={size.sm * 2} md={size.md * 2} lg={size.lg * 2} xl={size.xl * 2}>
								<Field name="description" component={MyInput} />
							</Grid>
							<Grid item xs={size.xs} sm={size.sm} md={size.md} lg={size.lg} xl={size.xl}>
								<Field name="image_url" type="url" component={MyInput} />
							</Grid>
							<Grid item xs={size.xs} sm={size.sm} md={size.md} lg={size.lg} xl={size.xl}>
								<Field name="director" as="select" component={MySelect} items={personsFullNames.length !== 0 ? personsFullNames : []} labelText="Director" />
							</Grid>
							<Grid item xs={size.xs} sm={size.sm} md={size.md} lg={size.lg} xl={size.xl}>
								<SubmitButton isSubmitting={isSubmitting} status={status} />
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
			<ErrorDialog open={open} handleClose={handleClose} msg={msg} />
		</Container>
	);
}

const mapStateToProps = (state) => {
	return {
		persons: getAllPersons(state),
		load: state.flow.get_all_persons,
		personsFullNames: getPersonsFullNames(state),
	};
};

const mapDispatchToProps = {
	createMovie,
	editMovie,
	getPersonsList,
	flowPersons,
};

export default connect(mapStateToProps, mapDispatchToProps)(MovieForm);
