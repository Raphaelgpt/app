import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOS } from '../../context/OSContext';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { Window } from './Window';
import { DesktopIcon } from './DesktopIcon';
import { BroadcastOverlay } from './BroadcastOverlay';
import { 
  Folder, 
  Globe, 
  Settings, 
  Terminal,
  FileText,
  Image,
  Download,
  Trash2 
} from 'lucide-react';

const DESKTOP_BG = 'https://images.pexels.com/photos/28428587/pexels-photo-28428587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

export const Desktop = () => {
  const { 
    openWindows, 
    activeWindowId, 
    startMenuOpen, 
    activeBroadcast,
    currentUser,
    openWindow,
    setStartMenuOpen 
  } = useOS();

  const desktopIcons = [
    { id: 'file-explorer', title: 'Explorateur', icon: Folder, component: 'FileExplorer' },
    { id: 'browser', title: 'Navigateur', icon: Globe, component: 'FakeBrowser' },
    ...(currentUser?.role === 'admin' ? [
      { id: 'admin-panel', title: 'Admin Panel', icon: Settings, component: 'AdminPanel' },
      { id: 'cmd', title: 'Terminal', icon: Terminal, component: 'CMD' },
    ] : []),
    { id: 'documents', title: 'Documents', icon: FileText, component: 'FileExplorer', props: { initialPath: 'Documents' } },
    { id: 'images', title: 'Images', icon: Image, component: 'FileExplorer', props: { initialPath: 'Images' } },
    { id: 'downloads', title: 'Téléchargements', icon: Download, component: 'FileExplorer', props: { initialPath: 'Téléchargements' } },
    { id: 'recycle', title: 'Corbeille', icon: Trash2, component: 'RecycleBin' },
  ];

  const handleDesktopClick = (e) => {
    if (e.target === e.currentTarget) {
      setStartMenuOpen(false);
    }
  };

  return (
    <div 
      data-testid="desktop"
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        backgroundImage: `url(${DESKTOP_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={handleDesktopClick}
    >
      {/* Desktop Icons Grid */}
      <div 
        className="absolute top-4 left-4 grid grid-cols-1 gap-1"
        style={{ gridAutoRows: 'min-content' }}
      >
        {desktopIcons.map((icon, index) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            title={icon.title}
            icon={icon.icon}
            onClick={() => openWindow({
              id: icon.id,
              title: icon.title,
              component: icon.component,
              icon: icon.icon,
              ...(icon.props || {}),
            })}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {openWindows.map((window) => (
          <Window
            key={window.id}
            {...window}
            isActive={activeWindowId === window.id}
          />
        ))}
      </AnimatePresence>

      {/* Start Menu */}
      <AnimatePresence>
        {startMenuOpen && <StartMenu />}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar />

      {/* Broadcast Overlay */}
      <AnimatePresence>
        {activeBroadcast && <BroadcastOverlay broadcast={activeBroadcast} />}
      </AnimatePresence>
    </div>
  );
};
