import {Routes, Route,Navigate } from "react-router";
import Homepage from './pages/Homepage';
import  Signup  from './pages/Signup';
import  Login from "./pages/Login";
import { useDispatch,useSelector} from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./authSlice";
import CosmicBackground from "./pages/CosmicBackground";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin"
import AdminDelete from "./components/AdminDelete";
import AdminPanel from "./components/AdminPanel";
import AdminVideo from "./components/AdminVideo"
import AdminUpload from "./components/AdminUpload";

function App()
{
    const {isAuthenticated,user,loading} =  useSelector((state)=>state.auth);
  const dispatch = useDispatch();


  useEffect(()=>{
   dispatch(checkAuth());
  },[dispatch]);
  
  if (loading) {
    return (
    <CosmicBackground>
    <div className="min-h-screen flex items-center justify-center h-40 ">
      <span className="loading loading-spinner loading-lg bg-amber-50"></span>
    </div>
    </CosmicBackground>
    )
  }


  return (
    <>
   <div className=" min-h-screen  overflow-y-auto">

    <Routes>
    <Route path="/" element={isAuthenticated? <Homepage></Homepage>:<Navigate to="/Signup"/>}> </Route>
    <Route path="/Login" element={isAuthenticated?<Navigate to="/"/>:<Login></Login>}></Route>
    <Route path="/Signup" element={isAuthenticated?<Navigate to="/"/>:<Signup></Signup>}></Route>    
    <Route path="/problem/:problemId" element={<ProblemPage></ProblemPage>}></Route>
     <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
    <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
    <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
     <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload/> : <Navigate to="/" />} />

      <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />



   </Routes>


   </div>
    </>
  )
}

export default App;