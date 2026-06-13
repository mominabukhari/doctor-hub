// import React, { useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X } from 'lucide-react';
// import { GlassCard } from './GlassCard';

// export const Modal = ({ isOpen, onClose, title, children }) => {
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
//             onClick={onClose}
//           />
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//               className="pointer-events-auto w-full max-w-lg"
//             >
//               <GlassCard className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
//                   <button
//                     onClick={onClose}
//                     className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//                 {children}
//               </GlassCard>
//             </motion.div>
//           </div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg overflow-hidden border border-slate-800 bg-slate-900 rounded-2xl shadow-2xl p-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="mt-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};