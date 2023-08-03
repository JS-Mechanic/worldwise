import styles from "./Map.module.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {useEffect, useState} from "react";
import {useCities} from "../contexts/CitiesContext.jsx";
import {useGeolocation} from "../hooks/useGeolocation.js";
import Button from "./Button.jsx";

export default function Map() {
	const {cities} = useCities();
	const [mapPosition, setMapPosition] = useState(["52.3676", "4.9041"]);
	const [searchParams] = useSearchParams();
	const {
		isLoading: isLoadingPosition,
		position: geolocationPosition,
		getPosition,
	} = useGeolocation();

	const mapLat = searchParams.get("lat");
	const mapLng = searchParams.get("lng");

	useEffect(() => {
		if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
	}, [mapLat, mapLng]);

	useEffect(() => {
		if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
	}, [geolocationPosition]);

	return (
		<div className={styles.mapContainer}>
			{!geolocationPosition && (
				<Button type="position" onClick={getPosition}>
					{isLoadingPosition ? "Loading..." : "Use your position"}
				</Button>
			)}
			<MapContainer center={mapPosition} zoom={9} scrollWheelZoom={true} className={styles.map}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
				/>
				{cities.length &&
					cities.map(city => (
						<Marker key={city.id} position={[city.position.lat, city.position.lng]}>
							<Popup>
								<span>
									{city.emoji} <span>{city.cityName}</span>
								</span>
							</Popup>
						</Marker>
					))}
				<ChangeCenter position={mapPosition} />
				<DetectClick />
			</MapContainer>
		</div>
	);
}

function ChangeCenter({position}) {
	const map = useMap();
	map.setView(position);
	return null;
}

function DetectClick() {
	const navigate = useNavigate();
	useMapEvents({
		click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
	});
}
