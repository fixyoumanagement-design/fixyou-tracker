import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle } from '../lib/firebase';
import { Lock, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ADMIN_EMAIL = "fixyoumanagement@gmail.com";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        if (u.email === ADMIN_EMAIL && u.emailVerified) {
          setUser(u);
          setError(null);
        } else {
          setError("Access Denied: Restricted to authorized administrators only.");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center font-mono">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg uppercase tracking-widest text-[#141414] flex items-center gap-3"
        >
          <div className="w-4 h-4 bg-[#141414] animate-pulse" />
          Initializing System...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border-2 border-[#141414] p-10 shadow-[8px_8px_0px_0px_#141414]"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#141414] text-white flex items-center justify-center">
              <Lock size={32} />
            </div>
          </div>
          
          <h1 className="text-3xl font-black uppercase tracking-tighter text-[#141414] mb-2 text-center">
            System Lock
          </h1>
          <p className="text-gray-500 font-mono text-sm mb-8 text-center uppercase tracking-tight">
            Fixyou Management Dashboard
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 text-red-700 text-xs font-mono"
            >
              {error}
            </motion.div>
          )}

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-[#141414] text-white px-6 py-4 font-bold uppercase tracking-widest hover:bg-[#2A2A2A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#141414] focus:ring-offset-2"
          >
            <LogIn size={20} />
            Login with Google
          </button>
          
          <p className="mt-8 text-[10px] text-gray-400 font-mono text-center uppercase">
            Authorized Personnel Only
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
