import React, { useState } from "react";
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { deleteMovie } from "../ducks/movies/operations";
import { connect } from "react-redux";
import ErrorDialog from "./FormComponents/ErrorDialog";

function MovieCard({ movie, deleteMovie, onDetails, disableDelete }, props) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [openError, setOpenError] = useState(false);
	const [pending, setPending] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDeleteMovie = (movie) => {
		deleteMovie(movie).then((res) => {
			if (res.error) {
				setPending(false);
				handleOpenError();
			} else {
				setPending(false);
				handleCloseError();
				setTimeout(() => navigate("/movies"), 100);
			}
		});
	};

	const handleOpenError = () => {
		setOpenError(true);
	};

	const handleCloseError = () => {
		setOpenError(false);
	};

	const [expanded, setExpanded] = useState(false);
	const [visibility, setVisibility] = useState("visible");
	const [opacity, setOpacity] = useState("1");

	const handleExpandClick = () => {
		if (expanded) {
			setVisibility("visible");
			setOpacity("1");
		} else {
			setVisibility("hidden");
			setOpacity("0");
		}
		setExpanded(!expanded);
	};

	const ExpandMore = styled((props) => {
		const { expand, ...other } = props;
		return <IconButton {...other} />;
	})(({ theme, expand }) => ({
		transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	}));

	return (
		<>
			{movie && (
				<Card variant="outlined" sx={{ maxWidth: "300px", boxShadow: 2 }}>
					<CardActionArea onClick={() => navigate(`/movies/${movie.id}`, { state: movie })}>
						<CardMedia component="img" height="445px" image={movie.image_url} alt={movie.title} />
						<CardContent sx={{ paddingBottom: 0 }}>
							<Typography noWrap={onDetails ? false : true} sx={onDetails && { wordBreak: "break-word" }} variant="h5" component="div">
								{movie.title}
							</Typography>
							<Typography variant="subtitle1" component="div">
								{`${movie.genre} ${new Date(movie.release_date).toDateString().slice(3)}`}
							</Typography>
							<Typography visibility={visibility} noWrap variant="body1" color="text.secondary" sx={{ opacity: opacity, transition: "visibility 0.300s linear, opacity 0.300s linear" }}>
								{movie.description}
							</Typography>
						</CardContent>
					</CardActionArea>
					<CardContent sx={{ pt: 0 }}>
						<Collapse sx={{ wordWrap: "break-word" }} in={expanded} timeout="auto" unmountOnExit>
							<Typography variant="body1" color="text.secondary">
								{movie.description}
							</Typography>
						</Collapse>
					</CardContent>
					<CardActions disableSpacing>
						<ExpandMore sx={{ ml: 0 }} expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
							<ExpandMoreIcon />
						</ExpandMore>
						<IconButton disabled={pending} onClick={() => navigate("/movies/form", { state: movie })} sx={{ ml: "auto" }} color="info">
							<EditIcon />
						</IconButton>
						<IconButton disabled={disableDelete || pending} onClick={handleClickOpen} color="secondary">
							<DeleteIcon />
						</IconButton>
					</CardActions>
				</Card>
			)}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle sx={{ wordBreak: "break-word" }}>{`Confirm '${movie && movie.title}' delete?`}</DialogTitle>
				<DialogContent>
					<DialogContentText>This is a permanent action</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>No</Button>
					<Button
						onClick={() => {
							setPending(true);
							handleClose();
							handleDeleteMovie(movie);
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
	deleteMovie,
};

export default connect(mapStateToProps, mapDispatchToProps)(MovieCard);
