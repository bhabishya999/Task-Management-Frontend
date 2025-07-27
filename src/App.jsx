import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import Unauthorized401 from "./views/Unauthorized401.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/dashboard"
                       element={
                           <ProtectedRoute>
                               <Dashboard/>
                           </ProtectedRoute>
                       }
                />
                <Route path="/401" element={<Unauthorized401/>}/>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar/>
        </Router>
    );
}

export default App;
