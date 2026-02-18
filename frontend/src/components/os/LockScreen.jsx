import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useOS } from '../../context/OSContext';

const LOCKSCREEN_BG = 'https://images.unsplash.com/photo-1638618527547-353b97140809?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHw0fHxXaW5kb3dzJTIwMTElMjBkYXJrJTIwYmx1ZSUyMGJsb29tJTIwYWJzdHJhY3QlMjB3YWxscGFwZXJ8ZW58MHx8fHwxNzcxNDIyNDUwfDA&ixlib=rb-4.1.0&q=85';

export const LockScreen = () => {
  const { login } = useOS();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await login(username, password);
    
    setLoading(false);
    if (!result.success) {
      setError(result.message);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <motion.div
      data-testid="lock-screen"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${LOCKSCREEN_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      <AnimatePresence mode="wait">
        {!showLogin ? (
          <motion.div
            key="time-display"
            className="relative z-10 text-center text-white cursor-pointer select-none"
            onClick={() => setShowLogin(true)}
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="text-[96px] font-light leading-none tracking-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {formatTime(time)}
            </motion.div>
            <motion.div 
              className="text-2xl font-light mt-2 capitalize"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {formatDate(time)}
            </motion.div>
            <motion.p 
              className="mt-8 text-sm text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Cliquez pour vous connecter
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="login-form"
            className="relative z-10 flex flex-col items-center"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* User Avatar */}
            <div className="w-28 h-28 rounded-full bg-[#60CDFF]/20 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-4 shadow-2xl">
              <User className="w-14 h-14 text-white" strokeWidth={1.5} />
            </div>

            {/* Login Card */}
            <motion.div 
              data-testid="login-form"
              className="w-[320px] bg-[#202020]/80 backdrop-blur-2xl rounded-xl border border-white/10 p-6 shadow-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-white/70 uppercase tracking-wider">Identifiant</label>
                  <div className="relative">
                    <input
                      data-testid="username-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#60CDFF] focus:ring-1 focus:ring-[#60CDFF] transition-all"
                      placeholder="Entrez votre identifiant"
                      autoFocus
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/70 uppercase tracking-wider">Mot de passe</label>
                  <div className="relative">
                    <input
                      data-testid="password-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#60CDFF] focus:ring-1 focus:ring-[#60CDFF] transition-all"
                      placeholder="Entrez votre mot de passe"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    data-testid="login-error"
                    className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                <button
                  data-testid="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#60CDFF] hover:bg-[#4CC2FF] text-black font-medium py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              <button
                data-testid="back-to-lockscreen-btn"
                onClick={() => {
                  setShowLogin(false);
                  setError('');
                }}
                className="w-full mt-4 text-white/60 hover:text-white text-sm transition-colors"
              >
                Retour
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom info */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white/60 text-xs">
        <span>Windows 11 Simulation</span>
        <span>Français (France)</span>
      </div>
    </motion.div>
  );
};
