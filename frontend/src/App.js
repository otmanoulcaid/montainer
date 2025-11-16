import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./App.css"; // optional global styles
import { useState } from "react";
import useAuth from "./hooks/useAuth";

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
