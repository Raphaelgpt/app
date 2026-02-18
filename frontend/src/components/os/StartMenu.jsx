import React from 'react';
import { motion } from 'framer-motion';
import { useOS } from '../../context/OSContext';
import { 
  Folder, 
  Globe, 
  Settings, 
  Terminal,
  FileText,
  Image,
  Download,
  Power,
  User,
  Search,
  Calculator,
  Calendar,
  Clock
} from 'lucide-react';

export const StartMenu = () => {
  const { currentUser, logout, openWindow, setStartMenuOpen } = useOS();

  const pinnedApps = [
    { id: 'file-explorer', title: 'Explorateur', icon: Folder, component: 'FileExplorer' },
    { id: 'browser', title: 'Navigateur', icon: Globe, component: 'FakeBrowser' },
    { id: 'documents', title: 'Documents', icon: FileText, component: 'FileExplorer', props: { initialPath: 'Documents' } },
    { id: 'images', title: 'Images', icon: Image, component: 'FileExplorer', props: { initialPath: 'Images' } },
    { id: 'downloads', title: 'Téléchargements', icon: Download, component: 'FileExplorer', props: { initialPath: 'Téléchargements' } },
    { id: 'calculator', title: 'Calculatrice', icon: Calculator, component: 'Calculator' },
    ...(currentUser?.role === 'admin' ? [
      { id: 'admin-panel', title: 'Admin Panel', icon: Settings, component: 'AdminPanel' },
      { id: 'cmd', title: 'Terminal CMD', icon: Terminal, component: 'CMD' },
    ] : []),
  ];

  const recommendedItems = [
    { title: 'Bienvenue.txt', icon: FileText, time: 'Récemment ajouté' },
    { title: 'Guide Utilisateur.pdf', icon: FileText, time: 'Il y a 2 jours' },
    { title: 'Capture.png', icon: Image, time: 'Hier' },
  ];

  const handleAppClick = (app) => {
    openWindow({
      id: app.id,
      title: app.title,
      component: app.component,
      icon: app.icon,
      ...(app.props || {}),
    });
    setStartMenuOpen(false);
  };

  return (
    <motion.div
      data-testid="start-menu"
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[600px] bg-[#202020]/90 backdrop-blur-3xl rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            data-testid="start-search-input"
            type="text"
            placeholder="Rechercher des applications, paramètres et documents"
            className="w-full bg-[#2d2d2d] border border-white/10 rounded-full px-10 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#60CDFF] transition-colors"
          />
        </div>
      </div>

      {/* Pinned Section */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Épinglé</h2>
          <button className="text-xs text-[#60CDFF] hover:text-[#4CC2FF] transition-colors">
            Toutes les applications →
          </button>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {pinnedApps.map((app) => (
            <motion.button
              key={app.id}
              data-testid={`start-app-${app.id}`}
              onClick={() => handleAppClick(app)}
              className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white/10 transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <app.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-xs text-white/90 text-center line-clamp-1">{app.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recommended Section */}
      <div className="px-4 py-2 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Recommandé</h2>
          <button className="text-xs text-[#60CDFF] hover:text-[#4CC2FF] transition-colors">
            Plus →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {recommendedItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center">
                <item.icon className="w-5 h-5 text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.title}</p>
                <p className="text-xs text-white/50">{item.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/20">
        <button 
          data-testid="start-user-profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#60CDFF]/20 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm text-white">{currentUser?.username}</p>
            <p className="text-xs text-white/50 capitalize">{currentUser?.role}</p>
          </div>
        </button>

        <motion.button
          data-testid="logout-button"
          onClick={() => {
            setStartMenuOpen(false);
            logout();
          }}
          className="p-2.5 rounded-lg hover:bg-white/10 transition-colors group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Power className="w-5 h-5 text-white/70 group-hover:text-red-400 transition-colors" />
        </motion.button>
      </div>
    </motion.div>
  );
};
