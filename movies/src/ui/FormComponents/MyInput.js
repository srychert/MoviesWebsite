import { FormControl, TextField } from "@mui/material";
import React from "react";

function MyInput({ field, form, ...props }) {
	const fieldName = field.name;
	const labelName = fieldName.replace("_", " ");
	const withError = <TextField label={labelName} error helperText={form.errors[fieldName]} {...field} {...props} />;
	const normal = <TextField label={labelName} {...field} {...props} />;
	return <FormControl fullWidth>{form.errors[fieldName] && form.touched[fieldName] ? withError : normal}</FormControl>;
}

export default MyInput;
