import {Routes, Route } from "react-router";
import Homepage from './pages/Homepage';
import  Signup  from './pages/Signup';
import  Login from "./pages/Login";
function App()
{
  return (
    <>
    <Routes>
    <Route path="/" element={<Homepage></Homepage>}></Route>
    <Route path="/login" element={<Login></Login>}></Route>
    <Route path="/Signup" element={<Signup></Signup>}></Route>    
   </Routes>
    </>
  )
}

export default App;