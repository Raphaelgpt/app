import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const OSContext = createContext(null);

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within OSProvider');
  }
  return context;
};

export const OSProvider = ({ children }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [activeBroadcast, setActiveBroadcast] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Check for active broadcasts
  const checkBroadcast = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/broadcast/active`);
      if (res.data && res.data.is_active) {
        setActiveBroadcast(res.data);
      }
    } catch (e) {
      console.error('Error checking broadcast:', e);
    }
  }, []);

  useEffect(() => {
    if (!isLocked && currentUser) {
      checkBroadcast();
      const interval = setInterval(checkBroadcast, 5000);
      return () => clearInterval(interval);
    }
  }, [isLocked, currentUser, checkBroadcast]);

  // Login
  const login = async (username, password) => {
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      if (res.data.success) {
        setCurrentUser(res.data.user);
        setIsLocked(false);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (e) {
      return { success: false, message: 'Erreur de connexion au serveur' };
    }
  };

  // Logout
  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsLocked(true);
    setOpenWindows([]);
    setActiveWindowId(null);
    setStartMenuOpen(false);
  }, []);

  // Window management
  const openWindow = useCallback((windowConfig) => {
    const windowId = windowConfig.id || `window-${Date.now()}`;
    
    // Check if window already exists
    const existingWindow = openWindows.find(w => w.id === windowId);
    if (existingWindow) {
      setActiveWindowId(windowId);
      // Restore if minimized
      setOpenWindows(prev => prev.map(w => 
        w.id === windowId ? { ...w, minimized: false } : w
      ));
      return;
    }

    const newWindow = {
      id: windowId,
      title: windowConfig.title || 'Fenêtre',
      component: windowConfig.component,
      icon: windowConfig.icon,
      width: windowConfig.width || 800,
      height: windowConfig.height || 600,
      x: windowConfig.x || 100 + (openWindows.length * 30),
      y: windowConfig.y || 50 + (openWindows.length * 30),
      minimized: false,
      maximized: false,
      zIndex: openWindows.length + 1,
    };

    setOpenWindows(prev => [...prev, newWindow]);
    setActiveWindowId(windowId);
    setStartMenuOpen(false);
  }, [openWindows]);

  const closeWindow = useCallback((windowId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      const remaining = openWindows.filter(w => w.id !== windowId);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  }, [activeWindowId, openWindows]);

  const minimizeWindow = useCallback((windowId) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, minimized: true } : w
    ));
  }, []);

  const maximizeWindow = useCallback((windowId) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, maximized: !w.maximized } : w
    ));
  }, []);

  const focusWindow = useCallback((windowId) => {
    setActiveWindowId(windowId);
    const maxZ = Math.max(...openWindows.map(w => w.zIndex), 0);
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: maxZ + 1, minimized: false } : w
    ));
  }, [openWindows]);

  const updateWindowPosition = useCallback((windowId, x, y) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, x, y } : w
    ));
  }, []);

  // Dismiss broadcast
  const dismissBroadcast = useCallback(async () => {
    if (activeBroadcast) {
      try {
        await axios.delete(`${API}/broadcast/${activeBroadcast.id}`);
        setActiveBroadcast(null);
      } catch (e) {
        console.error('Error dismissing broadcast:', e);
      }
    }
  }, [activeBroadcast]);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const value = {
    isLocked,
    currentUser,
    openWindows,
    activeWindowId,
    startMenuOpen,
    activeBroadcast,
    notifications,
    login,
    logout,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    setStartMenuOpen,
    dismissBroadcast,
    addNotification,
    checkBroadcast,
  };

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
};
