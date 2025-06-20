import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerUser } from '../authSlice';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

const Signup = () => {
  const dispatch =useDispatch();
  const navigate = useNavigate();
  const{ isAuthenticated,loading, error }= useSelector((state)=> state.auth);
  const [showPassword,setshowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(()=>{

      if(isAuthenticated)
      {
        navigate('/');
      }
  },[isAuthenticated,navigate])

      const onSubmit = (data) => {
    dispatch(registerUser(data));
      };

  const formValues = watch();
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [activeInput, setActiveInput] = useState(null);
  const canvasRef = useRef(null);
  const trailsRef = useRef([]);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  

  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      const particleCount = 100;
      const colors = ['#4e22ff', '#ff2a6d', '#05d9e8', '#d1f7ff', '#a5a6ff'];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw cursor trail
      for (let i = 0; i < trailsRef.current.length; i++) {
        const trail = trailsRef.current[i];
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(78, 34, 255, ${trail.opacity})`;
        ctx.fill();
        
        // Update trail properties
        trail.size += 0.2;
        trail.opacity -= 0.015;
        
        // Remove faded trails
        if (trail.opacity <= 0) {
          trailsRef.current.splice(i, 1);
          i--;
        }
      }
      
      // Draw and update particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parseInt(p.color.slice(1, 3), 16)}, ${parseInt(p.color.slice(3, 5), 16)}, ${parseInt(p.color.slice(5, 7), 16)}, ${p.opacity})`;
        ctx.fill();
        
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Boundary check
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
        
        // React to cursor
        const dx = cursorPosition.x - p.x;
        const dy = cursorPosition.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          p.speedX += dx * 0.001 * force;
          p.speedY += dy * 0.001 * force;
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    createParticles();
    animate();
    
    return () => cancelAnimationFrame(animationRef.current);
  }, []);
  
  // Handle mouse movement
  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
    
    // Add new trail
    trailsRef.current.push({
      x: e.clientX,
      y: e.clientY,
      size: 5,
      opacity: 0.8
    });
    
    // Limit trail length
    if (trailsRef.current.length > 20) {
      trailsRef.current.shift();
    }
  };
  
  const handleInputFocus = (name) => {
    setActiveInput(name);
  };
  
  const handleInputBlur = () => {
    setActiveInput(null);
  };

  return (
    <div 
      className="min-h-screen bg-[#0a0a1a] overflow-hidden relative font-sans"
      onMouseMove={handleMouseMove}
    >
      {/* Background canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      
      {/* Floating cosmic elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4e22ff] opacity-10 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#ff2a6d] opacity-10 blur-[100px] animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-[#05d9e8] opacity-15 blur-[80px] animate-pulse animation-delay-2000"></div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative rounded-3xl p-1 w-full max-w-md backdrop-blur-2xl"
          style={{
            background: 'linear-gradient(45deg, rgba(78, 34, 255, 0.5), rgba(255, 42, 109, 0.5), rgba(5, 217, 232, 0.5))',
            boxShadow: '0 0 50px rgba(78, 34, 255, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Glass morphism effect */}
          <div 
            className="bg-[#0a0a1a] bg-opacity-70 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden"
            style={{
              boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Animated floating elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4e22ff] rounded-full filter blur-[50px] opacity-20 animate-float"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#ff2a6d] rounded-full filter blur-[50px] opacity-20 animate-float animation-delay-2000"></div>
            
            {/* Header */}
            <div className="flex justify-center mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a5a6ff] to-[#05d9e8]">
                SIGN UP
              </h1>
            </div>
            
            {/* Form */}
           <form onSubmit={handleSubmit(onSubmit)}>
             <div className="space-y-8">
              {/* Name field */}
              <div className="relative">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder=" "
                    {...register('firstName')}
                    className="w-full bg-[#151530] border-b-2 border-[#4e22ff] rounded-t-lg pt-6 pb-2 px-3 text-white focus:outline-none focus:border-[#a5a6ff] transition-all duration-300 peer"
                    onFocus={() => handleInputFocus('firstName')}
                    onBlur={handleInputBlur}
                  />
                  <label 
                    className={`absolute left-3 text-gray-400 transition-all duration-300 transform ${
                      formValues.firstName || activeInput === 'firstName' 
                        ? 'text-sm -translate-y-5 text-[#a5a6ff]' 
                        : 'top-3'
                    } peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:text-[#a5a6ff]`}
                  >
                    Your Name
                  </label>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#a5a6ff] transition-all duration-500 peer-focus:w-full"></div>
                </div>
                {errors.firstName && (
                  <div className="mt-1 h-6">
                    <span className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Email field */}
              <div className="relative">
                <div className="relative">
                  <input 
                    type="email"
                    placeholder=" "
                    {...register('emailId')}
                    className="w-full bg-[#151530] border-b-2 border-[#ff2a6d] rounded-t-lg pt-6 pb-2 px-3 text-white focus:outline-none focus:border-[#ff5e8d] transition-all duration-300 peer"
                    onFocus={() => handleInputFocus('emailId')}
                    onBlur={handleInputBlur}
                  />
                  <label 
                    className={`absolute left-3 text-gray-400 transition-all duration-300 transform ${
                      formValues.emailId || activeInput === 'emailId' 
                        ? 'text-sm -translate-y-5 text-[#ff2a6d]' 
                        : 'top-3'
                    } peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:text-[#ff2a6d]`}
                  >
                    Email Address
                  </label>
                </div>
                {errors.emailId && (
                  <div className="mt-1 h-6">
                    <span className="text-red-500 text-sm">
                      {errors.emailId.message}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Password field */}
              <div className="relative">
                <div className="relative">
                  <input 
                  type={showPassword ? "text" : "password"}
                    placeholder=" "
                    {...register('password')}
                    className="w-full bg-[#151530] border-b-2 border-[#05d9e8] rounded-t-lg pt-6 pb-2 px-3 text-white focus:outline-none focus:border-[#5defff] transition-all duration-300 peer"
                    onFocus={() => handleInputFocus('password')}
                    onBlur={handleInputBlur}
                  />
                  <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" // Added transform for better centering, styling
                  onClick={() => setshowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                  <label 
                    className={`absolute left-3 text-gray-400 transition-all duration-300 transform ${
                      formValues.password || activeInput === 'password' 
                        ? 'text-sm -translate-y-5 text-[#05d9e8]' 
                        : 'top-3'
                    } peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:text-[#05d9e8]`}
                  >
                    Password
                  </label>
                </div>
                {errors.password && (
                  <div className="mt-1 h-6">
                    <span className="text-red-500 text-sm">
                      {errors.password.message}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Submit button */}
              <button 
                type="submit"
                className={`w-full relative overflow-hidden py-4 rounded-xl font-bold text-white mt-8 transition-all duration-500 hover:scale-[1.03]  ${loading ? 'loading' : ''} `}
                disabled={loading}
                style={{
                  background: 'linear-gradient(45deg, #4e22ff, #ff2a6d)',
                  boxShadow: '0 0 20px rgba(78, 34, 255, 0.5)'
                }}
              >
                <span className="relative z-10">{loading?'Creating...' : 'Create Account'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff2a6d] to-[#05d9e8] opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-0 h-full bg-white opacity-20 hover:w-full transition-all duration-700"></div>
              </button>
            </div>
           </form>
            
            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-500">
                Already have an account? 
                <NavLink to="/login" className="text-[#05d9e8] font-medium hover:underline ml-1">
                  
                  Sign In
                </NavLink>
                
                {/* <a href="#" className="text-[#05d9e8] font-medium hover:underline ml-1">Sign In</a> */}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom cursor */}
      <div 
        className="fixed w-8 h-8 rounded-full border-2 border-[#4e22ff] pointer-events-none z-50 transition-transform duration-100"
        style={{
          transform: `translate(${cursorPosition.x - 14}px, ${cursorPosition.y - 14}px)`,
          boxShadow: '0 0 15px #4e22ff, 0 0 30px #4e22ff, inset 0 0 10px #4e22ff'
        }}
      >
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#05d9e8] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Floating text */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-[#a5a6ff] text-sm animate-pulse">
        <p>Enhance Your Coding Journey With Aki</p>
      </div>
      
      {/* Global styles */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          100% { transform: translateY(0) translateX(0) rotate(0deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        body {
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          cursor: none !important;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #0a0a1a;
          color: white;
        }
        
        /* Floating label fix */
        input:not(:placeholder-shown) + label,
        input:focus + label {
          top: 6px !important;
          font-size: 0.875rem !important;
          transform: translateY(-1.25rem) !important;
        }
      `}</style>
    </div>
  );
};

export default Signup;





// import React, { useState, useRef, useEffect } from 'react';

// const Signup = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
//   const triggerRef = useRef(null);
//   const formRef = useRef(null);

//   const handleOpen = () => {
//     if (triggerRef.current) {
//       const rect = triggerRef.current.getBoundingClientRect();
//       setPosition({
//         top: rect.top,
//         left: rect.left,
//         width: rect.width,
//         height: rect.height
//       });
//     }
//     setIsOpen(true);
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//   };

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }

//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [isOpen]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4">
//       {/* Rainbow border animation styles */}
//       <style jsx>{`
//         @keyframes rainbow-border {
//           0% { border-color: #ff0000; }
//           16% { border-color: #ff8000; }
//           33% { border-color: #ffff00; }
//           50% { border-color: #00ff00; }
//           66% { border-color: #0000ff; }
//           83% { border-color: #4b0082; }
//           100% { border-color: #9400d3; }
//         }
        
//         .rainbow-border {
//           animation: rainbow-border 3s linear infinite;
//           border-width: 3px;
//         }
//       `}</style>
      
//       <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-indigo-900">
//         Welcome to Our Coding platform
//       </h1>
//       <p className="text-lg text-gray-600 max-w-lg text-center mb-12">
//         Create an account to access exclusive features and content. Click the button below to get started!
//       </p>
      
//       {/* Trigger button */}
//       <div 
//         ref={triggerRef}
//         onClick={handleOpen}
//         className={`
//           cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-5 px-10 rounded-full
//           shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl
//           flex items-center justify-center space-x-3
//           ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
//         `}
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//         </svg>
//         <span>Sign Up Now</span>
//       </div>
      
//       {/* Animated form overlay */}
//       <div 
//         className={`
//           fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10
//           transition-opacity duration-500
//           ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
//         `}
//         onClick={handleClose}
//       ></div>
      
//       {/* Signup form with rainbow border animation */}
//       <div 
//         ref={formRef}
//         className={`
//           fixed z-20  rounded-2xl shadow-2xl
//           transition-all duration-500 ease-in-out
//           ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
//         `}
//         style={{
//           top: isOpen ? '50%' : `${position.top}px`,
//           left: isOpen ? '50%' : `${position.left}px`,
//           width: isOpen ? '90%' : `${position.width}px`,
//           height: isOpen ? 'auto' : `${position.height}px`,
//           maxWidth: isOpen ? '500px' : '100%',
//           transform: isOpen ? 'translate(-50%, -50%)' : 'none',
//           border: isOpen ? '3px solid transparent' : 'none'
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Rainbow border element */}
//         {isOpen && (
//           <div className="rainbow-border absolute inset-0 rounded-2xl pointer-events-none"></div>
//         )}
        
//         <div className="p-8">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-3xl font-bold text-white">Create Account</h2>
//             <button 
//               onClick={handleClose}
//               className="text-gray-500 hover:text-gray-700 transition-colors z-30 relative"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
          
//           <form className="space-y-6">
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="name" className="block text-white font-medium mb-2">Full Name</label>
//                 <input 
//                   type="text" 
//                   id="name" 
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
//                   placeholder="AKi soni"
//                 />
//               </div>
              
//               <div>
//                 <label htmlFor="email" className="block text-white font-medium mb-2">Email Address</label>
//                 <input 
//                   type="email" 
//                   id="email" 
//                   className="w-full px-4 py-3 rounded-xl border  text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
//                   placeholder="Aki@example.com"
//                 />
//               </div>
              
//               <div>
//                 <label htmlFor="password" className="block text-white font-medium mb-2">Password</label>
//                 <input 
//                   type="password" 
//                   id="password" 
//                   className="w-full px-4 py-3 rounded-xl border b text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
//                   placeholder="••••••••"
//                 />
//               </div>
              
//               <div>
//                 <label htmlFor="confirm-password" className="block text-white font-medium mb-2">Confirm Password</label>
//                 <input 
//                   type="password" 
//                   id="confirm-password" 
//                   className="w-full px-4 py-3 rounded-xl border  text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>
            
//             <div className="flex items-center">
//               <input 
//                 type="checkbox" 
//                 id="terms" 
//                 className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
//               />
//               <label htmlFor="terms" className="ml-2 text-gray-600">
//                 I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms and Conditions</a>
//               </label>
//             </div>
            
//             <button 
//               type="submit"
//               className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
//             >
//               Create Account
//             </button>
//           </form>
          
//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Already have an account? 
//               <a href="#" className="text-indigo-600 font-medium hover:underline ml-1">Sign in</a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;





//  <div className="">  
//     <div className="  relative flex border-2 h-40 w-170 justify-center items-center flex-col">
//     <h1 className="absolute  top-2 ">LeetCode</h1>
//      <p>Click On me </p>
//     </div>
//     </div>














// import { useEffect , useState } from "react";
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// // schema validation 
// const signupSchema = z.object({
//     firstName:z.string().min(3,"Name Should be Atleast 3 Charcter"),
//     emailId: z.string().email(),
//     password: z.string().min(8,"Password Should be Atleast 8 Charcter"),

// })

// function Signup()
// {
//     const {  register, handleSubmit, formState: { errors },} = useForm({resolver:zodResolver(signupSchema)});
//     const Submitdata =(data)=>
//     {
//         console.log(data);
//     }
//     return(
//         <>  
//         <form onSubmit={handleSubmit(Submitdata)} className="gap-2 flex flex-col min-h-screen justify-center items-center">

//         <input {...register('firstName')} placeholder="Enter the First Name"></input> {errors.firstName && (<span>{errors.firstName.message}</span>)}
 
//         <input {...register('email')} placeholder="Enter the Email"></input>
//         <input {...register('password') } type="password"    placeholder="Enter the password"></input>

//         <button type="submit" className="btn" >Submit </button>
//         </form>
        
//         </>
//     )
// }

// export default Signup;










// function Signup()
// {

//     const [name,setName]= useState('');
//     const [email,setEmail]= useState('');
//     const [password,setPassword]= useState('');

//     const handleSubmit=(e)=>{
//     //    e.preventDefault();
//     console.log(name,email,password);


//     }
//     return(
//         <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center gap-y-3">

//         <input type="text" value={name} placeholder="Enter Your First Name" onChange={(e)=>setName(e.target.value)}></input>
//         <input type="email" value={email} placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)}></input>
//         <input type="password" value={password} placeholder="Enter Your password" onChange={(e)=>setPassword(e.target.value)}></input>
//         <button type="submit" >Submit</button>
 
//         </form>
//     )
// }