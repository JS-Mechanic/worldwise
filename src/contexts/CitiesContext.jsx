import {createContext, useContext, useEffect, useReducer} from "react";

const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext(null);

const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {},
	error: "",
};

function reducer(state, action) {
	switch (action.type) {
		case "loading":
			return {...state, isLoading: true};
		case "cities/loaded":
			return {...state, isLoading: false, cities: action.payload};
		case "city/loaded":
			return {...state, isLoading: false, city: action.payload};
		case "city/created":
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};
		case "city/deleted":
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter(city => city.id !== action.payload),
				currentCity: {},
			};
		case "rejected":
			return {...state, isLoading: false, error: action.payload};
		default:
			throw new Error("Unknown Action Type!");
	}
}

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

	async function createCity(newCity) {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities/`, {
				method: "POST",
				body: JSON.stringify(newCity),
				headers: {"Content-Type": "application/json"},
			});
			const data = await res.json();
			setCities(cities => setCities([...cities, data]));
		} catch (e) {
			alert("There was an error creating city!");
		} finally {
			setIsLoading(false);
		}
	}

	async function deleteCity(id) {
		try {
			setIsLoading(true);
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: "DELETE",
			});
			setCities(cities => cities.filter(city => city.id !== id));
		} catch (e) {
			alert("There was an error deleting city!");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<CitiesContext.Provider
			value={{cities, isLoading, currentCity, getCity, createCity, deleteCity}}>
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
