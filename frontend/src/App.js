import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./App.css"; // optional global styles
import { useState } from "react";
import useAuth from "./hooks/useAuth";

function App() {
  let [auth, setAuth] = useState(useAuth())
  return (
    <Router>
      <AppRoutes auth={auth} setAuth={setAuth} />
    </Router>
  );
}

export default App;
