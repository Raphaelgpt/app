import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-[#60CDFF]',
  warning: 'bg-yellow-500',
};

export const WindowsToast = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed bottom-16 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type] || Info;
          const color = colorMap[notification.type] || colorMap.info;
          
          return (
            <motion.div
              key={notification.id}
              data-testid={`toast-${notification.id}`}
              className="pointer-events-auto w-[360px] bg-[#2d2d2d]/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl overflow-hidden"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-start gap-3 p-4">
                <div className={`w-8 h-8 rounded-full ${color}/20 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1 min-w-0">
                  {notification.title && (
                    <p className="text-sm font-medium text-white mb-0.5">{notification.title}</p>
                  )}
                  <p className="text-sm text-white/70">{notification.message}</p>
                </div>
                <button
                  onClick={() => onDismiss(notification.id)}
                  className="p-1 rounded hover:bg-white/10 transition-colors shrink-0"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>
              {/* Progress bar */}
              <motion.div
                className={`h-0.5 ${color}`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
