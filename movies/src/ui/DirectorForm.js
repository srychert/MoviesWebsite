import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
// import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { patchMovieDirector } from "../ducks/movies/operations";
import MySelect from "./FormComponents/MySelect";
import SubmitButton from "./FormComponents/SubmitButton";
import ErrorDialog from "./FormComponents/ErrorDialog";
import * as _ from "lodash";

function DirectorForm({ movie, personsFullNames, patchMovieDirector }) {
	const [open, setOpen] = useState(false);
	const [msg, setMsg] = useState("");

	const handleSubmit = (values, setStatus, setSubmitting) => {
		patchMovieDirector(movie, values.director).then((res) => {
			console.log(res);
			if (res.error) {
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
			setSubmitting(false);
		});
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div style={{ maxWidth: "300px" }}>
			<Formik
				initialValues={{
					director: movie ? movie.director_id : personsFullNames[0] ? personsFullNames[0].id : null,
				}}
				validate={(values) => {
					console.log(values);
					const errors = {};
					const messages = {
						director: "Director required",
					};

					const validationRequierd = (key, value) => {
						if (!value) {
							errors[key] = messages[key];
						}
					};

					for (const [key, value] of Object.entries(values)) {
						validationRequierd(key, value);
					}

					return errors;
				}}
				onSubmit={(values, { setStatus, setSubmitting }) => handleSubmit(values, setStatus, setSubmitting)}
				enableReinitialize={true}
			>
				{({ isSubmitting, status }) => (
					<Form>
						<div style={{ marginBottom: 16 }}>{personsFullNames.length !== 0 && <Field name="director" as="select" component={MySelect} items={personsFullNames} labelText="Director" />}</div>
						<div>
							<SubmitButton isSubmitting={isSubmitting} status={status} />
						</div>
					</Form>
				)}
			</Formik>
			<ErrorDialog open={open} handleClose={handleClose} msg={msg} />
		</div>
	);
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {
	patchMovieDirector,
};

export default connect(mapStateToProps, mapDispatchToProps)(DirectorForm);
