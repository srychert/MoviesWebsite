import React, { useState } from "react";
import { Avatar, Button, Card, CardActionArea, CardActions, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { deletePerson } from "../ducks/persons/operations";
import { connect } from "react-redux";
import ErrorDialog from "./FormComponents/ErrorDialog";

function PersonCard({ person, deletePerson, onDetails, maxWidth, disableDelete }, props) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [openError, setOpenError] = useState(false);
	const [pending, setPending] = useState(false);
	const allColors = [amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal];
	const avatarColors = allColors.map((x) => x[500]);
	// eslint-disable-next-line no-unused-vars
	const [randomColor, setRandomColor] = useState(avatarColors[Math.floor(Math.random() * avatarColors.length)]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDeletePerson = (person) => {
		deletePerson(person).then((res) => {
			if (res.error) {
				setPending(false);
				handleOpenError();
			} else {
				setPending(false);
				handleCloseError();
				setTimeout(() => navigate("/persons"), 100);
			}
		});
	};

	const handleOpenError = () => {
		setOpenError(true);
	};

	const handleCloseError = () => {
		setOpenError(false);
	};

	return (
		<>
			<Card variant="outlined" sx={{ maxWidth: maxWidth || 300, boxShadow: 2 }}>
				{person && (
					<CardActionArea onClick={() => navigate(`/persons/${person.id}`, { state: person })}>
						<CardHeader
							sx={{
								alignItems: "start",
								"& .MuiCardHeader-content": {
									overflow: "hidden",
								},
							}}
							disableTypography
							avatar={
								<Avatar sx={{ bgcolor: randomColor }} aria-label="person">
									<PersonIcon />
								</Avatar>
							}
							title={
								<>
									<Typography noWrap={onDetails ? false : true} sx={onDetails && { wordBreak: "break-word" }} variant="body2">
										{person.first_name}
									</Typography>
									<Typography noWrap={onDetails ? false : true} sx={onDetails && { wordBreak: "break-word" }} variant="body2">
										{person.last_name}
									</Typography>
								</>
							}
							subheader={
								<Typography variant="body2" color="text.secondary">
									{`${person.nationality} ${new Date(person.birth_date).toDateString().slice(3)}`}
								</Typography>
							}
						/>
					</CardActionArea>
				)}
				<CardActions disableSpacing>
					<IconButton disabled={pending} onClick={() => navigate("/persons/form", { state: person })} sx={{ ml: "auto" }} color="info">
						<EditIcon />
					</IconButton>
					<IconButton disabled={disableDelete || pending} onClick={handleClickOpen} color="secondary">
						<DeleteIcon />
					</IconButton>
				</CardActions>
			</Card>
			<Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle sx={{ wordBreak: "break-word" }} id="alert-dialog-title">{`Confirm '${person && person.first_name} ${person && person.last_name}' delete?`}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">This is a permanent action</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>No</Button>
					<Button
						onClick={() => {
							setPending(true);
							handleClose();
							handleDeletePerson(person);
						}}
						autoFocus
					>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
			<ErrorDialog open={openError} handleClose={handleClose} handleCloseError={handleCloseError} />
		</>
	);
}

const mapStateToProps = (state) => {
	return {};
};
const mapDispatchToProps = {
	deletePerson,
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonCard);
