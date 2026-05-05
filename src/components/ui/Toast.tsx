import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={cn(
            "fixed bottom-10 right-10 z-[100] border-2 border-[#141414] p-4 flex items-center gap-3 shadow-[6px_6px_0px_0px_#141414]",
            type === 'success' ? "bg-emerald-50 text-[#141414]" : "bg-red-50 text-[#141414]"
          )}
        >
          {type === 'success' ? (
            <CheckCircle className="text-emerald-500" size={20} />
          ) : (
            <AlertCircle className="text-red-500" size={20} />
          )}
          <span className="font-mono text-xs font-bold uppercase tracking-widest">{message}</span>
          <button onClick={onClose} className="ml-4 p-1 hover:bg-black/5 rounded">
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
