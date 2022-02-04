import { Button, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import DoneIcon from "@mui/icons-material/Done";
import SendIcon from "@mui/icons-material/Send";
import React from "react";

function SubmitButton({ isSubmitting, status }) {
	return (
		<Box item sx={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
			<Button
				type="submit"
				variant="contained"
				color="secondary"
				disabled={isSubmitting}
				endIcon={status && status.sent ? <DoneIcon /> : <SendIcon />}
				sx={
					status &&
					status.msg &&
					status.sent && {
						bgcolor: "success.main",
						"&:hover": {
							bgcolor: "success.dark",
						},
					}
				}
			>
				Submit
			</Button>
			{isSubmitting && (
				<CircularProgress
					size={24}
					sx={{
						color: "success.main",
						position: "absolute",
						top: "50%",
						left: "50%",
						marginLeft: "-12px",
						marginTop: "-12px",
					}}
				/>
			)}
		</Box>
	);
}

export default SubmitButton;
