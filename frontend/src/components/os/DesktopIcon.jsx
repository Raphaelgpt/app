import React from 'react';
import { motion } from 'framer-motion';

export const DesktopIcon = ({ id, title, icon: IconComponent, onClick, style }) => {
  return (
    <motion.button
      data-testid={`desktop-icon-${id}`}
      className="flex flex-col items-center gap-1 w-20 p-2 rounded hover:bg-white/10 active:bg-white/5 transition-colors cursor-pointer group"
      onClick={onClick}
      onDoubleClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={style}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <IconComponent className="w-10 h-10 text-white drop-shadow-lg" strokeWidth={1} />
      </div>
      <span className="text-xs text-white text-center leading-tight icon-text-shadow line-clamp-2">
        {title}
      </span>
    </motion.button>
  );
};
