import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
// import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { addActor } from "../ducks/movies/operations";
import MySelect from "./FormComponents/MySelect";
import SubmitButton from "./FormComponents/SubmitButton";
import ErrorDialog from "./FormComponents/ErrorDialog";
import { flowActors } from "../ducks/flow/actions";
import * as _ from "lodash";

function ActorForm({ movie, persons, addActor, movieActors, flowActors }) {
	const [open, setOpen] = useState(false);
	const personsWithName = persons.map((x) => ({ name: x.first_name + " " + x.last_name, ...x }));
	const actorsId = movieActors.map((x) => x.person_id);
	const personsForSelect = personsWithName.filter((x) => !actorsId.some((ele) => ele === x.id));
	const [msg, setMsg] = useState("");

	const handleSubmit = (values, setStatus, setSubmitting) => {
		addActor(movie, values.actor).then((res) => {
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
				flowActors(false)
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
					actor: null,
				}}
				validate={(values) => {
					console.log(values);
					const errors = {};
					const messages = {
						actor: "Actor required",
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
						<div style={{ marginBottom: 16 }}>{personsForSelect.length !== 0 && <Field name="actor" as="select" component={MySelect} items={personsForSelect} labelText="Actor" />}</div>
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
	addActor,
	flowActors,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActorForm);
