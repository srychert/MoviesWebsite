import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PieChartIcon from "@mui/icons-material/PieChart";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

function Layout({ children }, props) {
	const { window } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const navigate = useNavigate();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List>
				<ListItem button key={"Movies"} onClick={() => navigate("/movies")}>
					<ListItemIcon>{<LocalMoviesIcon color="primary" />}</ListItemIcon>
					<ListItemText sx={{ color: "primary.main" }} primary={"Movies"} />
				</ListItem>
				<ListItem button key={"Movies Add"} onClick={() => navigate("/movies/form")}>
					<ListItemIcon>{<AddCircleIcon color="secondary" />}</ListItemIcon>
					<ListItemText sx={{ color: "secondary.main" }} primary={"Add Movie"} />
				</ListItem>
				<ListItem button key={"Persons"} onClick={() => navigate("/persons")}>
					<ListItemIcon>{<PersonIcon color="info" />}</ListItemIcon>
					<ListItemText sx={{ color: "info.main" }} primary={"Persons"} />
				</ListItem>
				<ListItem button key={"PersonAdd"} onClick={() => navigate("/persons/form")}>
					<ListItemIcon>{<PersonAddAlt1Icon color="warning" />}</ListItemIcon>
					<ListItemText sx={{ color: "warning.main" }} primary={"Person Add"} />
				</ListItem>
				<ListItem button key={"Statistics"} onClick={() => navigate("/statistics")}>
					<ListItemIcon>{<PieChartIcon color="success" />}</ListItemIcon>
					<ListItemText sx={{ color: "success.main" }} primary={"Statistics"} />
				</ListItem>
			</List>
			<Divider />
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
				}}
			>
				<Toolbar>
					<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div" onClick={() => navigate("/")}>
						STAR MOVIES
					</Typography>
				</Toolbar>
			</AppBar>
			<Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="navigation panel">
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
					}}
					PaperProps={{
						sx: {
							backgroundColor: "#e6e6e6",
						},
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", sm: "block" },
						"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
					}}
					PaperProps={{
						sx: {
							backgroundColor: "#e6e6e6",
						},
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
			<Box component="main" sx={{ flexGrow: 1, pt: 3, width: `calc(100% - ${drawerWidth}px)` }}>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
}

export default Layout;
