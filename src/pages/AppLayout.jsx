import Sidebar from "../components/Sidebar.jsx";
import styles from "./AppLayout.module.css";
import Map from "../components/Map.jsx";
import {useAuth} from "../contexts/FakeAuthContext.jsx";
import User from "../components/User.jsx";

export default function AppLayout() {
	const {isAuthenticated} = useAuth();

	return (
		<div className={styles.app}>
			<Sidebar />
			<Map />
			{isAuthenticated && <User />}
		</div>
	);
}
