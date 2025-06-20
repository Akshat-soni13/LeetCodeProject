import { useState, useEffect, useRef } from 'react';

const CosmicBackground = ({ children }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const canvasRef = useRef(null);
  const trailsRef = useRef([]);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const contentRef = useRef(null); // New ref for content container

  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      const particleCount = 100;
      const colors = ['#4e22ff', '#ff2a6d', '#05d9e8', '#a5a6ff'];
      
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
      trailsRef.current.forEach((trail, i) => {
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
        }
      });
      
      // Draw and update particles
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
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
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    createParticles();
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle mouse movement
  const handleMouseMove = (e) => {
    setCursorPosition({ 
      x: e.clientX, 
      y: e.clientY 
    });
    
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

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-[#0a0a1a]"
      onMouseMove={handleMouseMove}
    >
      {/* Background canvas - behind content */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      
      {/* Content container - above background */}
      <div 
        ref={contentRef}
        className="relative z-10 h-full w-full"
      >
        {children}
      </div>
      
      {/* Fixed custom cursor */}
      <div 
        className="fixed w-8 h-8 rounded-full border-2 border-[#4e22ff] pointer-events-none z-50 transition-transform duration-100"
        style={{
          transform: `translate(${cursorPosition.x + 36}px, ${cursorPosition.y + 36}px) `,
          boxShadow: '0 0 15px #4e22ff, 0 0 30px #4e22ff, inset 0 0 10px #4e22ff'
        }}
      >
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#05d9e8] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div> 
  );
};

export default CosmicBackground;