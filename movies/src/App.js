import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./ui/Home";
import Layout from "./ui/Layout";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { pink, deepPurple } from "@mui/material/colors";
import PersonList from "./ui/PersonList";
import PersonForm from "./ui/PersonForm";
import MoviesList from "./ui/MoviesList";
import MovieForm from "./ui/MovieForm";
import PersonDetails from "./ui/PersonDetails";
import MovieDetails from "./ui/MovieDetails";
import Statistics from "./ui/Statistics";

const theme = createTheme({
	palette: {
		primary: deepPurple,
		secondary: pink,
		background: {
			default: "#e6e6e6",
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<Router>
					<Layout>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/movies" element={<MoviesList />} />
							<Route path="/movies/form" element={<MovieForm />} />
							<Route path="/movies/:id" element={<MovieDetails />} />
							<Route path="/persons" element={<PersonList />} />
							<Route path="/persons/form" element={<PersonForm />} />
							<Route path="/persons/:id" element={<PersonDetails />} />
							<Route path="/statistics" element={<Statistics />} />
						</Routes>
					</Layout>
				</Router>
			</div>
		</ThemeProvider>
	);
}

export default App;
