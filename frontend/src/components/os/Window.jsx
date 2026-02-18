import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { FileExplorer } from './apps/FileExplorer';
import { FakeBrowser } from './apps/FakeBrowser';
import { AdminPanel } from './apps/AdminPanel';
import { CMD } from './apps/CMD';
import { RecycleBin } from './apps/RecycleBin';
import { Calculator } from './apps/Calculator';

const componentMap = {
  FileExplorer,
  FakeBrowser,
  AdminPanel,
  CMD,
  RecycleBin,
  Calculator,
};

export const Window = ({ 
  id, 
  title, 
  component, 
  icon: IconComponent, 
  width, 
  height, 
  x, 
  y, 
  minimized, 
  maximized, 
  zIndex,
  isActive,
  ...props
}) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition } = useOS();
  const constraintsRef = useRef(null);

  const Component = componentMap[component];

  if (minimized) return null;

  const windowStyle = maximized 
    ? { top: 0, left: 0, right: 0, bottom: 48, width: '100%', height: 'calc(100vh - 48px)' }
    : { width, height };

  return (
    <>
      {/* Drag constraints container */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" style={{ bottom: 48 }} />
      
      <motion.div
        data-testid={`window-${id}`}
        className={`absolute bg-[#202020]/95 backdrop-blur-xl rounded-xl border overflow-hidden flex flex-col ${
          isActive ? 'border-white/15 shadow-2xl' : 'border-white/5 shadow-lg'
        }`}
        style={{ 
          ...windowStyle,
          zIndex,
          ...(maximized ? {} : { x, y }),
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          ...(maximized ? { x: 0, y: 0, borderRadius: 0 } : {})
        }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
        drag={!maximized}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        onDragEnd={(e, info) => {
          if (!maximized) {
            updateWindowPosition(id, x + info.offset.x, y + info.offset.y);
          }
        }}
        onClick={() => focusWindow(id)}
      >
        {/* Title Bar */}
        <div 
          data-testid={`window-titlebar-${id}`}
          className={`flex items-center justify-between h-9 px-3 shrink-0 ${
            isActive ? 'bg-[#2d2d2d]' : 'bg-[#252525]'
          }`}
        >
          <div className="flex items-center gap-2 select-none">
            {IconComponent && <IconComponent className="w-4 h-4 text-white/70" strokeWidth={1.5} />}
            <span className="text-sm text-white/90 font-normal">{title}</span>
          </div>

          <div className="flex items-center -mr-1">
            <button
              data-testid={`window-minimize-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(id);
              }}
              className="w-11 h-9 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Minus className="w-4 h-4 text-white/70" strokeWidth={1.5} />
            </button>
            <button
              data-testid={`window-maximize-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(id);
              }}
              className="w-11 h-9 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              {maximized ? (
                <Square className="w-3.5 h-3.5 text-white/70" strokeWidth={1.5} />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-white/70" strokeWidth={1.5} />
              )}
            </button>
            <button
              data-testid={`window-close-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(id);
              }}
              className="w-11 h-9 flex items-center justify-center hover:bg-red-500 transition-colors group"
            >
              <X className="w-4 h-4 text-white/70 group-hover:text-white" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-[#1a1a1a]">
          {Component ? (
            <Component {...props} />
          ) : (
            <div className="flex items-center justify-center h-full text-white/50">
              Application non disponible
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};
