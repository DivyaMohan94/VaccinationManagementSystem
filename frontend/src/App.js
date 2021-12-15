import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import Register from './pages/register';
import Landing from "./pages/landing";
import Login from "./pages/login";
import Admin from "./pages/Admin";
import Report from "./pages/Report";
import Dashboard from "./components/Dashboard/dashboard";
import FutureAppointmentComponent from "./components/Appointment/futureAppointmentsComponents";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/home" exact>
            <Route exact path="/home" element={<Home />} />
          </Route>
          <Route path="/" exact>
            <Route exact path="/" element={<Landing />} />
          </Route>
          <Route path="/register" exact>
            <Route exact path="/register" element={<Register />} />
          </Route>
          <Route path="/login" exact>
            <Route exact path="/login" element={<Login />} />
          </Route>
          <Route path="/admin" exact>
            <Route exact path="/admin" element={<Admin />} />
          </Route>
          <Route path="/report" exact>
            <Route exact path="/report" element={<Report />} />
          </Route>
          <Route path="/dashboard" exact>
            <Route exact path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/futureappts" exact>
            <Route exact path="/futureappts" element={<FutureAppointmentComponent />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
