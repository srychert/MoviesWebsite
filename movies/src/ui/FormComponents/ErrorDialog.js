import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

function ErrorDialog({ open, handleClose, handleCloseError, msg }) {
	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Error</DialogTitle>
			<DialogContent>
				<DialogContentText>Error ocured form was not sent {msg}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseError || handleClose}>Ok</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ErrorDialog;
