import { TextField } from "@mui/material";
import React from "react";

function MyDate({ field, form, ...props }) {
	const fieldName = field.name;
	const labelName = fieldName.replace("_", " ");
	const withError = <TextField label={labelName} InputLabelProps={{ shrink: true }} error helperText={form.errors[fieldName]} {...field} {...props} sx={{ width: "100%" }} />;
	const normal = <TextField label={labelName} InputLabelProps={{ shrink: true }} {...field} {...props} sx={{ width: "100%" }} />;
	return <>{form.errors[fieldName] && form.touched[fieldName] ? withError : normal}</>;
}

export default MyDate;
