import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { OSProvider, useOS } from './context/OSContext';
import { LockScreen } from './components/os/LockScreen';
import { Desktop } from './components/os/Desktop';
import './App.css';

const OSContent = () => {
  const { isLocked } = useOS();

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {isLocked ? (
          <LockScreen key="lockscreen" />
        ) : (
          <Desktop key="desktop" />
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <OSProvider>
      <OSContent />
    </OSProvider>
  );
}

export default App;
