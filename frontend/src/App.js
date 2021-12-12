import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import Register from './pages/register';
import Landing from "./pages/landing";
import Login from "./pages/login"
import Profile from "./pages/profile";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/home" exact>
              <Route exact path="/home" element={<Home/>}/>
            </Route>
            <Route path="/" exact>
              <Route exact path="/" element={<Landing/>}/>
            </Route>
            <Route path="/register" exact>
              <Route exact path="/register" element={<Register/>}/>
            </Route>   
            <Route path="/login" exact>
              <Route exact path="/login" element={<Login/>}/>
            </Route> 
            <Route path="/profile" exact>
              <Route exact path="/profile" element={<Profile/>}/>
            </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
