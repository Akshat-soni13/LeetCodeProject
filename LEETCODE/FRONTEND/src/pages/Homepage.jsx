// src/pages/Homepage.jsx
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import axiosClient from '../utils/axiosClient';
import CosmicBackground from "./CosmicBackground";

function Homepage() 
{

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

  const handleLogout = () => {
    // console.log("hi")
    dispatch(logoutUser());
    setSolvedProblems([]);  
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const problemsResponse = await axiosClient.get('/problem/getAllProblem');
        setProblems(problemsResponse.data);
        
        if (user) {
          const solvedResponse = await axiosClient.get('/problem/problemSolvedByUser');
          setSolvedProblems(solvedResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // console.log("HI")
  }, [user]);

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-emerald-500 text-white';
      case 'medium': return 'bg-amber-500 text-gray-900';
      case 'hard': return 'bg-rose-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };
  console.log(user)
  return (
    <CosmicBackground >
      <div className="min-h-screen flex flex-col">
        {/* Animated Navbar */}
        <nav className="flex justify-between items-center bg-gradient-to-r from-blue-900/90 to-indigo-900/90 backdrop-blur-sm py-3 px-6 shadow-lg sticky top-0 z-50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-blue-500 rounded-full blur-md opacity-75 animate-pulse"></div>
              <img 
                src="https://static.vecteezy.com/system/resources/previews/019/153/003/original/3d-minimal-programming-icon-coding-screen-web-development-concept-laptop-with-a-coding-screen-and-a-coding-icon-3d-illustration-png.png" 
                className="h-14 w-14 object-contain relative"
                alt="Logo"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
              Aki's Code
            </h1>
          </div>

          <div className="flex items-center">
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                className="btn bg-blue-800/60 hover:bg-blue-700/80 text-white px-6 py-2 rounded-full border border-cyan-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <span className="font-medium">{user?.firstName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <ul 
                tabIndex={0} 
                className="dropdown-content menu p-2 mt-2 shadow-lg bg-blue-900/90 backdrop-blur-sm rounded-box w-52 border border-cyan-500/30"
              >
                <li>
                  <button 
                    onClick={handleLogout}
                    className="text-white hover:bg-blue-700/50 rounded-lg py-2 px-4 transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </button>
                </li>
        
                {user.role === 'admin' && <li  className="text-white hover:bg-blue-700/50 rounded-lg py-1 px-1 transition-colors duration-200 flex justify-center "><NavLink to="/admin"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-user-icon lucide-shield-user"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M6.376 18.91a6 6 0 0 1 11.249.003"/><circle cx="12" cy="11" r="4"/></svg>Admin</NavLink></li>}       
                 </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-grow container mx-auto px-4 py-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Challenge Your Skills
              </h2>
              <p className="text-lg text-cyan-200 max-w-2xl mx-auto">
                Solve coding problems across various difficulties and topics. Track your progress and level up your coding abilities.
              </p>
            </div>

            {/* Animated Filter Section */}
            <div className="flex flex-wrap justify-center gap-4 mb-10  animate-slide-up  ">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-all duration-500 "></div>
                <select 
                  className="relative select bg-blue-900/80 text-white rounded-xl border border-cyan-500/30 py-1 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 group-hover:bg-blue-900/90 "
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Problems</option>
                  <option value="solved">Solved Problems</option>
                </select>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                <select 
                  className="relative select bg-blue-900/80 text-white rounded-xl border border-emerald-500/30 py-1 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 group-hover:bg-blue-900/90"
                  value={filters.difficulty}
                  onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                <select 
                  className="relative select bg-blue-900/80 text-white rounded-xl border border-purple-500/30 py-1 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 group-hover:bg-blue-900/90"
                  value={filters.tag}
                  onChange={(e) => setFilters({...filters, tag: e.target.value})}
                >
                  <option value="all">All Tags</option>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>

            {/* Problems List */}
            <div className="grid gap-4">
          {filteredProblems.map(problem => (
            <div key={problem._id} className="card bg-blue-950 text-white shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some(sp => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info">
                    {problem.tags}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
          </div>
        </div>
      </div>
     </CosmicBackground> 
          
  );
}

export default Homepage;






// <div className="space-y-6">
//               {loading ? (
//                 <div className="flex justify-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//                 </div>
//               ) : filteredProblems.length === 0 ? (
//                 <div className="text-center py-12 rounded-2xl bg-blue-900/30 backdrop-blur-sm border border-cyan-500/20">
//                   <div className="text-2xl text-cyan-200 font-medium mb-2">No problems found</div>
//                   <p className="text-blue-200">Try adjusting your filters</p>
//                 </div>
//               ) : (
//                 filteredProblems.map((problem, index) => (
//                   <NavLink 
//                     key={problem._id} 
//                     to={`/problem/${problem._id}`}
//                     className="block group"
//                   >
//                     <div 
//                       className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
//                       style={{
//                         transitionDelay: `${index * 50}ms`,
//                         animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
//                         opacity: 0,
//                         transform: 'translateY(20px)'
//                       }}
//                     >
//                       {/* Animated border */}
//                       <div className="absolute -inset-[2px] rounded-2xl overflow-hidden z-0">
//                         <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-running-border opacity-30 group-hover:opacity-70 transition-opacity
//                         + duration-500"></div>
//                       </div>
                      
//                       {/* 3D Pressure Plate Effect */}
//                       <div className="relative z-10 bg-gradient-to-b from-blue-900/70 to-blue-800/70 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-5 transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                           <div className="flex-grow">
//                             <div className="flex items-center gap-3 mb-2">
//                               <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
//                                 {problem.title}
//                               </h3>
//                               {solvedProblems.some(sp => sp._id === problem._id) && (
//                                 <div className="flex items-center bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-500/30">
//                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                   </svg>
//                                   Solved
//                                 </div>
//                               )}
//                             </div>
                            
//                             <div className="flex flex-wrap gap-2">
//                               <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeColor(problem.difficulty)}`}>
//                                 {problem.difficulty}
//                               </div>
//                               <div className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
//                                 {problem.tags}
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div className="flex-shrink-0">
//                             <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors duration-300">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 group-hover:text-cyan-200 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
//                               </svg>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </NavLink>
//                 ))
//               )}
//             </div>











//     import { useEffect, useState } from 'react';
// import { NavLink } from 'react-router'; // Fixed import

// import { useDispatch, useSelector } from 'react-redux';
// import { logoutUser } from '../authSlice';
// import axiosClient from '../utils/axiosClient';
// import CosmicBackground from "./cosmicBackground";

// function Homepage()
// {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const [problems, setProblems] = useState([]);
//   const [solvedProblems, setSolvedProblems] = useState([]);
//     const [filters, setFilters] = useState({
//     difficulty: 'all',
//     tag: 'all',
//     status: 'all' 
//   });


//   const handleLogout=()=>{
//     dispatch(logoutUser());
//     setSolvedProblems([]); // Clear solved problems on logout
//         }
 
//     useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         const { data } = await axiosClient.get('/problem/getAllProblem');
//         setProblems(data);
//       } catch (error) {
//         console.error('Error fetching problems:', error);
//       }
//     };  

//     const fetchSolvedProblems = async () => {
//       try {
//         const { data } = await axiosClient.get('/problem/problemSolvedByUser');
//         setSolvedProblems(data);
//       } catch (error) {
//         console.error('Error fetching solved problems:', error);
//       }
//     };

//     fetchProblems();
//     if (user) fetchSolvedProblems();
//   }, [user]);


//   const filteredProblems = problems.filter(problem => {
//     const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
//     const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
//     const statusMatch = filters.status === 'all' || 
//                       solvedProblems.some(sp => sp._id === problem._id);
//     return difficultyMatch && tagMatch && statusMatch;
//   });


//     return(
//         <>
//             <CosmicBackground>

//             <nav className="flex justify-between  bg-blue-950  ">
//                 <div className="flex items-center ml-10">
// <img src="https://static.vecteezy.com/system/resources/previews/019/153/003/original/3d-minimal-programming-icon-coding-screen-web-development-concept-laptop-with-a-coding-screen-and-a-coding-icon-3d-illustration-png.png"  className="h-20 "></img>
// <h1 className=" text-white text-#6ee7ff">Aki's COde</h1>
//                  </div>

//             <div className="flex items-center">

//                 <div className="dropdown dropdown-end ">
//             <div tabIndex={0} className="btn   bg-blue-950 text-green-50 mr-10 ">
//               {user?.firstName}
//             </div>
//             <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-blue-950 text-green-50 rounded-box w-52">
//               <li><button onClick={handleLogout}>Logout</button></li>
//             </ul>
//             </div>
//             </div>

//             </nav>
//             {/* Main Content */}
//       <div className="container mx-auto p-4">
//         {/* Filters */}
//         <div className="flex flex-wrap gap-4 mb-6 ">
//           {/* New Status Filter */}
//           <select 
//             className="select  bg-blue-950 text-white rounded-4xl border-2xl border-blue-400 "
//             value={filters.status}
//             onChange={(e) => setFilters({...filters, status: e.target.value})}
//           >
//             <option value="all">All Problems</option>
//             <option value="solved">Solved Problems</option>
//           </select>

//           <select 
//             className="select select-bordered  bg-blue-950 text-white  rounded-4xl border-2xl border-blue-400"
//             value={filters.difficulty}
//             onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
//           >
//             <option value="all">All Difficulties</option>
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>

//           <select 
//             className="select select-bordered  bg-blue-950 text-white  rounded-4xl border-2xl border-blue-400"
//             value={filters.tag}
//             onChange={(e) => setFilters({...filters, tag: e.target.value})}
//           >
//             <option value="all">All Tags</option>
//             <option value="array">Array</option>
//             <option value="linkedList">Linked List</option>
//             <option value="graph">Graph</option>
//             <option value="dp">DP</option>
//           </select>
//         </div>

        
//             {/* Problems List */}
//         <div className="grid gap-4 ">
//           {filteredProblems.map(problem => (
//             <div key={problem._id} className="card shadow-xl ">
//               <div className="card-body  bg-blue-950 text-white  border-blue-500 border-3 rounded-2xl ">
//                 <div className="flex items-center justify-between">
//                   <h2 className="card-title">
//                     <NavLink to={`/problem/${problem._id}`} className="hover:text-amber-300">
//                       {problem.title}
//                     </NavLink>
//                   </h2>
//                   {solvedProblems.some(sp => sp._id === problem._id) && (
//                     <div className="badge badge-success gap-2">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                       Solved
//                     </div>
//                   )}  
//                 </div>
                
//                 <div className="flex gap-2">
//                   <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)} hover:bg-amber-200`}>
//                     {problem.difficulty}
//                   </div>
//                   <div className="badge badge-info hover:bg-blue-500">
//                     {problem.tags}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>



          

//       </div>
            
//             </CosmicBackground>
//         </>
//     )
// }
// const getDifficultyBadgeColor = (difficulty) => {
//   switch (difficulty.toLowerCase()) {
//     case 'easy': return 'badge-success ';
//     case 'medium': return 'badge-warning';
//     case 'hard': return 'badge-error';
//     default: return 'badge-neutral';
//   }
// };

// export default Homepage;    


