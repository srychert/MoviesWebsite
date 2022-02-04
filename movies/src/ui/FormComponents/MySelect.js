import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React from "react";

function MySelect({ field, form, items, labelText, ...props }) {
	const { value, name, ...fieldRest } = field;
	return (
		<FormControl fullWidth error={form.errors[name] && form.touched[name]}>
			<InputLabel id={name}>{labelText}</InputLabel>
			<Select labelId={name} autoWidth={false} value={value ? value : ""} label={labelText} name={name} {...fieldRest} {...props}>
				{items.map((item) => (
					<MenuItem value={item.id} key={item.id}>
						<Typography noWrap>{item.name}</Typography>
					</MenuItem>
				))}
			</Select>
			<FormHelperText>{form.errors[name] && form.touched[name] && form.errors[name]}</FormHelperText>
		</FormControl>
	);
}

export default MySelect;
