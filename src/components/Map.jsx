import styles from "./Map.module.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {useState} from "react";
import {useCities} from "../contexts/CitiesContext.jsx";
export default function Map() {
	const navigate = useNavigate();
	const {cities} = useCities();
	const [mapPosition, setMapPosition] = useState([52.3676, 4.9041]);

	const [searchParams, setSearchParams] = useSearchParams();
	const lat = searchParams.get("lat");
	const lng = searchParams.get("lng");
	return (
		<div
			className={styles.mapContainer}
			onClick={() => {
				navigate("form");
			}}>
			<MapContainer center={mapPosition} zoom={13} scrollWheelZoom={true} className={styles.map}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
				/>
				{cities.map(city => (
					<Marker key={city.id} position={[city.position.lat, city.position.lng]}>
						<Popup>
							<span>
								{city.emoji} <span>{city.cityName}</span>
							</span>
						</Popup>
					</Marker>
				))}
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
