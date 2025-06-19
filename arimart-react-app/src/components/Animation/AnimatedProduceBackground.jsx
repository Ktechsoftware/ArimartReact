import { useEffect, useRef } from 'react';

const AnimatedProduceBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Produce items data
    const produceItems = [
      { type: 'apple', emoji: '🍎', size: 30, x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.5 },
      { type: 'banana', emoji: '🍌', size: 35, x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.3 },
      { type: 'carrot', emoji: '🥕', size: 25, x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.4 },
      { type: 'tomato', emoji: '🍅', size: 28, x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.6 },
      { type: 'grapes', emoji: '🍇', size: 32, x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.5 },
      { type: 'pepper', emoji: '🫑', size: 27, x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.4 },
    ];

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw shelf background
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
      
      // Draw wooden shelf edge
      ctx.fillStyle = '#d4a772';
      ctx.fillRect(0, canvas.height * 0.7 - 10, canvas.width, 10);

      // Animate produce items
      produceItems.forEach(item => {
        item.y += item.speed;
        if (item.y > canvas.height * 0.7 - item.size) {
          item.y = -item.size;
          item.x = Math.random() * canvas.width;
        }

        ctx.font = `${item.size}px serif`;
        ctx.fillText(item.emoji, item.x, item.y);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-green-50 to-amber-50">
      {/* Animated Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-20"
      />
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gray-100 bg-opacity-30 backdrop-blur-sm">
        {/* Shelf shadow */}
        <div className="absolute top-0 w-full h-2 bg-gray-300 bg-opacity-50"></div>
      </div>
      
      {/* Floating produce icons (HTML version as fallback) */}
      {['🍎', '🍊', '🥦', '🍓', '🥕', '🍋', '🍐', '🫐'].map((emoji, i) => (
        <div 
          key={i}
          className="absolute text-4xl animate-float"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${20 + (i * 5)}%`,
            animationDuration: `${15 + i * 3}s`,
            animationDelay: `${i * 0.5}s`
          }}
        >
          {emoji}
        </div>
      ))}
      
      {/* Add this to your Tailwind config for the animation */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Usage in your component:
export const StoreBackground = ({ children }) => {
  return (
    <div className="relative">
      <AnimatedProduceBackground />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};