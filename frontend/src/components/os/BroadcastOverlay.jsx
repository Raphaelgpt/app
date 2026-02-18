import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export const BroadcastOverlay = ({ broadcast }) => {
  const { dismissBroadcast, currentUser } = useOS();

  return (
    <motion.div
      data-testid="broadcast-overlay"
      className="fixed inset-0 z-[9999] bg-[#0078D4] flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close button for admin */}
      {currentUser?.role === 'admin' && (
        <button
          data-testid="broadcast-close-btn"
          onClick={dismissBroadcast}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-8 h-8 text-white" />
        </button>
      )}

      <motion.div
        className="flex flex-col items-center text-center max-w-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Icon */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <AlertTriangle className="w-24 h-24 text-white" strokeWidth={1.5} />
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="text-4xl font-light text-white mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {broadcast.title}
        </motion.h1>

        {/* Message */}
        <motion.p 
          className="text-xl text-white/90 mb-8 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {broadcast.message}
        </motion.p>

        {/* Dismiss button for users */}
        {currentUser?.role !== 'admin' && (
          <motion.button
            data-testid="broadcast-dismiss-btn"
            onClick={dismissBroadcast}
            className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded text-white font-medium transition-colors"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            J'ai compris
          </motion.button>
        )}

        {/* Meta info */}
        <motion.p 
          className="mt-8 text-sm text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Envoyé par {broadcast.created_by} • {new Date(broadcast.created_at).toLocaleString('fr-FR')}
        </motion.p>
      </motion.div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-white/40 text-sm">
        <span>Notification Système Windows 11</span>
        <span>Appuyez sur Échap pour fermer</span>
      </div>
    </motion.div>
  );
};
