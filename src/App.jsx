import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import Pricing from "./pages/Pricing.jsx";
import NotFound from "./pages/NotFound.jsx";
import AppLayout from "./pages/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import CityList from "./components/CityList.jsx";
import {useState, useEffect} from "react";
import CountryList from "./components/CountryList.jsx";

const BASE_URL = "https://my-json-server.typicode.com/JS-Mechanic/restapi";

function App() {
	const [cities, setCities] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function fetchCities() {
			try {
				setIsLoading(true);
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				setCities(data);
			} catch (e) {
				alert(e.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchCities();
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Home />} />
				<Route path="product" element={<Product />} />
				<Route path="pricing" element={<Pricing />} />
				<Route path="login" element={<Login />} />
				<Route path="app" element={<AppLayout />}>
					<Route index element={<CityList cities={cities} isLoading={isLoading} />} />
					<Route path="cities" element={<CityList cities={cities} isLoading={isLoading} />} />
					<Route path="countries" element={<CountryList cities={cities} isLoading={isLoading} />} />
					<Route path="form" element={<p>Form</p>} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
