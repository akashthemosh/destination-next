import { Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Home from "./components/home/Home";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default Routing;
