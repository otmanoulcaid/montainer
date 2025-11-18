import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import useAuth from "./hooks/useAuth";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated, loading] = useAuth();

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <Router>
          <AppRoutes auth={isAuthenticated} setAuth={setIsAuthenticated} />
        </Router>
      )}
    </>
  );
}
export default App;
