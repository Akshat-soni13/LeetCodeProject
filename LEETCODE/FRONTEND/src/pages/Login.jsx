import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { loginUser } from "../authSlice"


const LoginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is Incoorect ")
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({ resolver: zodResolver(LoginSchema) });


  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated,navigate]);

  const formValues = watch();
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [activeInput, setActiveInput] = useState(null);
  const canvasRef = useRef(null);
  const trailsRef = useRef([]);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

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
            <div className="flex justify-center mb-15">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a5a6ff] to-[#05d9e8]">
                LOGIN
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-8">

                {/* Email field */}
                <div className="relative ">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder=" "
                      {...register('emailId')}
                      className="w-full bg-[#151530] border-b-2 border-[#ff2a6d] rounded-t-lg pt-6 pb-2 px-3 text-white focus:outline-none focus:border-[#ff5e8d] transition-all duration-300 peer mb-3"
                      onFocus={() => handleInputFocus('emailId')}
                      onBlur={handleInputBlur}
                    />
                    <label
                      className={`absolute left-3 text-gray-400 transition-all duration-300 transform ${formValues.emailId || activeInput === 'emailId'
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
                <div className="relative mt-4">
                  <div className="relative">
                    <input
                      type="password"
                      placeholder=" "
                      {...register('password')}
                      className="w-full bg-[#151530] border-b-2 border-[#05d9e8] rounded-t-lg pt-6 pb-2 px-3 text-white focus:outline-none focus:border-[#5defff] transition-all duration-300 peer mt-3"
                      onFocus={() => handleInputFocus('password')}
                      onBlur={handleInputBlur}
                    />
                    <label
                      className={`absolute left-3 text-gray-400 transition-all duration-300 transform ${formValues.password || activeInput === 'password'
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
                  className="w-full relative overflow-hidden py-4 rounded-xl font-bold text-white mt-8 transition-all duration-500 hover:scale-[1.03]"
                  style={{
                    background: 'linear-gradient(45deg, #4e22ff, #ff2a6d)',
                    boxShadow: '0 0 20px rgba(78, 34, 255, 0.5)'
                  }}
                >
                  <span className="relative z-10">LOGIN ACCOUNT</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff2a6d] to-[#05d9e8] opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-0 w-0 h-full bg-white opacity-20 hover:w-full transition-all duration-700"></div>
                </button>
              </div>
            </form>
              {/* footer */}
            <div className="mt-6 text-center" >

              <p className="text-gray-500">
                create Your account-
                <NavLink to="/Signup" className="text-[#05d9e8] font-medium hover:underline ml-1">

                  Sign Up
                </NavLink>
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

export default Login;