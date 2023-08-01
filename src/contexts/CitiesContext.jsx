import {createContext, useContext, useEffect, useState} from "react";

const BASE_URL = "https://my-json-server.typicode.com/JS-Mechanic/restapi";
const CitiesContext = createContext(null);

export function CitiesProvider({children}) {
	const [cities, setCities] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [currentCity, setCurrentCity] = useState({});

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

	async function getCity(id) {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			setCurrentCity(data);
		} catch (e) {
			alert(e.message);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<CitiesContext.Provider value={{cities, isLoading, currentCity, getCity}}>
			{children}
		</CitiesContext.Provider>
	);
}

export function useCities() {
	const context = useContext(CitiesContext);
	if (context === undefined)
		throw new Error("Trying to access CitiesContext outside CitiesProvider!");
	return context;
}
