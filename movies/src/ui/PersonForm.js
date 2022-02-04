import { useState } from "react";
import { Container, Grid } from "@mui/material";
import { Field, Form, Formik } from "formik";
// import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createPerson, editPerson } from "../ducks/persons/operations";
import MySelect from "./FormComponents/MySelect";
import MyInput from "./FormComponents/MyInput";
import SubmitButton from "./FormComponents/SubmitButton";
import ErrorDialog from "./FormComponents/ErrorDialog";
import MyDate from "./FormComponents/MyDate";
import * as _ from "lodash";

const PersonForm = ({ createPerson, editPerson }, props) => {
	const navigate = useNavigate();
	// const { t } = useTranslation();
	const location = useLocation();
	const { id, ...personToEdit } = location.state ? location.state : {};
	const [open, setOpen] = useState(false);
	const [msg, setMsg] = useState("");

	const handleSubmit = (values, setStatus, setSubmitting) => {
		const operations = [createPerson, editPerson];

		operations[id ? 1 : 0]({ id, ...values }).then((res) => {
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
			setTimeout(() => {
				setSubmitting(false);
				id && navigate("/persons");
			}, 500);
		});
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const nationalities = ["American", "German", "Polish", "Russian", "Spanish"].map((x) => {
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
					Object.keys(personToEdit).length !== 0
						? {
								first_name: personToEdit.first_name,
								last_name: personToEdit.last_name,
								birth_date: personToEdit.birth_date.split("T")[0],
								nationality: personToEdit.nationality,
						  }
						: {
								first_name: "",
								last_name: "",
								birth_date: "",
								nationality: nationalities[0].id,
						  }
				}
				validate={(values) => {
					const errors = {};
					const maxLength = 50;
					const messages = {
						first_name: "First name required",
						first_name_length: `First name too long max ${maxLength} characters`,
						last_name: "Last name required",
						last_name_length: `Last name too long max ${maxLength} characters`,
						birth_date: "Birth date required",
						nationality: "Nationality name required",
						birth_date_from_future: "Birth date can't be from future",
					};

					const validationRequierd = (key, value) => {
						if (!value) {
							errors[key] = messages[key];
						}
					};

					const validateBirthDate = (birth_date) => {
						if (new Date(birth_date).setHours(0, 0, 0, 0) > new Date()) {
							errors.birth_date = messages.birth_date_from_future;
						}
					};

					const validationLength = (key, value) => {
						if (value.length > maxLength) {
							errors[key] = messages[key + "_length"];
						}
					};

					for (const [key, value] of Object.entries(values)) {
						validationRequierd(key, value);
					}

					validationLength("first_name", values.first_name);
					validationLength("last_name", values.last_name);
					validateBirthDate(values.birth_date);

					return errors;
				}}
				onSubmit={(values, { setStatus, setSubmitting }) => handleSubmit(values, setStatus, setSubmitting)}
				enableReinitialize={true}
			>
				{({ isSubmitting, status }) => (
					<Form>
						<Grid container spacing={2}>
							<Grid item xs={size.xs} sm={size.sm} md={size.md} lg={size.lg} xl={size.xl}>
								<Field name="first_name" component={MyInput} />
							</Grid>
							<Grid item xs={size.xs} sm={size.sm} md={size.md} lg={size.lg} xl={size.xl}>
								<Field name="last_name" component={MyInput} />
							</Grid>
							<Grid item xs={size.xs} sm={size.sm} md={size.md} lg={size.lg} xl={size.xl}>
								<Field name="birth_date" type="date" component={MyDate} />
							</Grid>
							<Grid item xs={size.xs} sm={size.sm} md={size.md} lg={size.lg} xl={size.xl}>
								<Field name="nationality" as="select" component={MySelect} items={nationalities} labelText="Nationality" />
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
};

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {
	createPerson,
	editPerson,
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonForm);
