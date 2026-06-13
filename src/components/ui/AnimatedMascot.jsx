// import React, { useEffect, useState } from 'react';
// import { motion, useAnimation } from 'framer-motion';

// export const AnimatedMascot = ({ inputFocus }) => {
//   const controls = useAnimation();
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     // Animate mascot based on which input is focused
//     if (inputFocus === 'email') {
//       controls.start({ x: -20, y: 10, rotate: -5, scale: 1.1 });
//     } else if (inputFocus === 'password') {
//       controls.start({ x: -20, y: 50, rotate: -15, scale: 1.1 });
//     } else {
//       controls.start({ x: 0, y: 0, rotate: 0, scale: 1 });
//     }
//   }, [inputFocus, controls]);

//   return (
//     <div className="relative w-full h-full flex items-center justify-center p-8">
//       {/* Background glow */}
//       <div className="absolute w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-glow" />
      
//       <motion.div
//         animate={controls}
//         transition={{ type: 'spring', stiffness: 100, damping: 10 }}
//         className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center"
//       >
//         {/* Floating Geometric Drone/Medical Assistant */}
//         <motion.svg
//           viewBox="0 0 200 200"
//           className="w-full h-full drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"
//           initial={{ y: -10 }}
//           animate={{ y: 10 }}
//           transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3, ease: 'easeInOut' }}
//         >
//           {/* Main Body */}
//           <motion.path
//             d="M 100,20 L 170,60 L 170,140 L 100,180 L 30,140 L 30,60 Z"
//             fill="rgba(15, 23, 42, 0.8)"
//             stroke="#10b981"
//             strokeWidth="4"
//           />
//           {/* Inner Hexagon */}
//           <motion.path
//             d="M 100,50 L 140,75 L 140,125 L 100,150 L 60,125 L 60,75 Z"
//             fill="rgba(16, 185, 129, 0.1)"
//             stroke="#34d399"
//             strokeWidth="2"
//             animate={{ rotate: 360 }}
//             transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
//             style={{ transformOrigin: 'center' }}
//           />
//           {/* Medical Cross */}
//           <g fill="#34d399">
//             <rect x="92" y="75" width="16" height="50" rx="4" />
//             <rect x="75" y="92" width="50" height="16" rx="4" />
//           </g>
//           {/* "Eye" / Scanner light */}
//           <motion.circle
//             cx="100"
//             cy="100"
//             r="4"
//             fill="#fff"
//             animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.5, 1] }}
//             transition={{ repeat: Infinity, duration: 1.5 }}
//           />
//         </motion.svg>
        
//         {/* Helper Label */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: inputFocus ? 1 : 0, y: inputFocus ? 0 : 10 }}
//           className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800/80 backdrop-blur border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium tracking-wide shadow-[0_0_10px_rgba(52,211,153,0.2)]"
//         >
//           {inputFocus === 'email' ? 'Scanning Identity...' : 'Securing Access...'}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };
import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedMascot = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-72">
      {/* Outer Rotating Energy Rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute w-64 h-64 border border-dashed border-emerald-500/30 rounded-full flex items-center justify-center"
      />
      
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-52 h-52 border border-emerald-400/20 rounded-xl"
      />

      {/* Main Mascot Base Structure */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          boxShadow: [
            "0 0 30px 2px rgba(16,185,129,0.2)",
            "0 0 50px 10px rgba(16,185,129,0.4)",
            "0 0 30px 2px rgba(16,185,129,0.2)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-40 h-40 bg-slate-900/80 border-2 border-emerald-400 rounded-full flex flex-col items-center justify-center backdrop-blur-xl"
      >
        {/* Animated Medical Drone Eyes */}
        <div className="flex gap-4 mb-2">
          <motion.div 
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]"
          />
          <motion.div 
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]"
          />
        </div>

        {/* Dynamic Medical Cross Icon */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-emerald-400 font-bold text-3xl"
        >
          ✚
        </motion.div>

        {/* Text pointing gesture effect */}
        <motion.p 
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold mt-2 animate-pulse"
        >
          Secure Access ➔
        </motion.p>
      </motion.div>

      {/* Ground Shadow Glow */}
      <div className="absolute bottom-2 w-32 h-3 bg-emerald-500/10 rounded-full filter blur-md animate-pulse" />
    </div>
  );
};