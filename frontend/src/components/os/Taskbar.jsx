import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOS } from '../../context/OSContext';
import { 
  LayoutGrid, 
  Search, 
  Folder, 
  Globe,
  Wifi,
  Volume2,
  Battery,
  ChevronUp
} from 'lucide-react';

export const Taskbar = () => {
  const { 
    openWindows, 
    activeWindowId, 
    startMenuOpen, 
    setStartMenuOpen,
    focusWindow,
    currentUser
  } = useOS();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getWindowIcon = (window) => {
    const iconMap = {
      'file-explorer': Folder,
      'browser': Globe,
      'documents': Folder,
      'images': Folder,
      'downloads': Folder,
    };
    return iconMap[window.id] || Folder;
  };

  return (
    <div 
      data-testid="taskbar"
      className="fixed bottom-0 left-0 right-0 h-12 bg-[#202020]/80 backdrop-blur-2xl flex items-center justify-center z-50 border-t border-white/5"
    >
      {/* Left section - System tray expander */}
      <div className="absolute left-2 flex items-center gap-1">
        <button 
          data-testid="system-tray-expand"
          className="p-2 rounded hover:bg-white/10 transition-colors"
        >
          <ChevronUp className="w-4 h-4 text-white/70" />
        </button>
      </div>

      {/* Center section - Pinned apps */}
      <div className="flex items-center gap-1">
        {/* Start Button */}
        <motion.button
          data-testid="start-button"
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          className={`p-2.5 rounded hover:bg-white/10 transition-colors ${startMenuOpen ? 'bg-white/10' : ''}`}
          whileTap={{ scale: 0.95 }}
        >
          <LayoutGrid className="w-5 h-5 text-white" strokeWidth={1.5} />
        </motion.button>

        {/* Search */}
        <button 
          data-testid="search-button"
          className="p-2.5 rounded hover:bg-white/10 transition-colors"
        >
          <Search className="w-5 h-5 text-white" strokeWidth={1.5} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Open Windows */}
        {openWindows.map((window) => {
          const IconComponent = window.icon || getWindowIcon(window);
          return (
            <motion.button
              key={window.id}
              data-testid={`taskbar-window-${window.id}`}
              onClick={() => focusWindow(window.id)}
              className={`relative p-2.5 rounded hover:bg-white/10 transition-colors group ${
                activeWindowId === window.id ? 'bg-white/10' : ''
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <IconComponent className="w-5 h-5 text-white" strokeWidth={1.5} />
              {/* Active indicator */}
              <div 
                className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all ${
                  activeWindowId === window.id 
                    ? 'w-4 bg-[#60CDFF]' 
                    : 'w-1.5 bg-white/50'
                }`}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#2d2d2d] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {window.title}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Right section - System tray */}
      <div className="absolute right-2 flex items-center gap-0.5">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer">
          <Wifi className="w-4 h-4 text-white/80" strokeWidth={1.5} />
          <Volume2 className="w-4 h-4 text-white/80" strokeWidth={1.5} />
          <Battery className="w-4 h-4 text-white/80" strokeWidth={1.5} />
        </div>

        <button 
          data-testid="datetime-button"
          className="flex flex-col items-end px-2 py-1 rounded hover:bg-white/10 transition-colors"
        >
          <span className="text-xs text-white">{formatTime(time)}</span>
          <span className="text-xs text-white/70">{formatDate(time)}</span>
        </button>

        {/* User indicator */}
        {currentUser && (
          <div 
            data-testid="user-indicator"
            className="ml-2 px-2 py-1 rounded bg-white/5 text-xs text-white/60"
          >
            {currentUser.role === 'admin' ? '👑' : '👤'} {currentUser.username}
          </div>
        )}
      </div>
    </div>
  );
};
