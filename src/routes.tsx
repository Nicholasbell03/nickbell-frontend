import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
const App = lazy(() => import("./App"));

function AppRoutes() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<Suspense fallback={<div>Loading...</div>}>
						<App />
					</Suspense>
				}
			/>
		</Routes>
	);
}

export default AppRoutes;
