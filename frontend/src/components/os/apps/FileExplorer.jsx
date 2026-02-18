import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronUp,
  Search,
  LayoutGrid,
  List,
  Folder,
  FileText,
  Image,
  Music,
  Video,
  File,
  HardDrive,
  Home as HomeIcon
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';

// Mock file system
const fileSystem = {
  'Ce PC': {
    type: 'root',
    children: {
      'Documents': {
        type: 'folder',
        children: {
          'Bienvenue.txt': { type: 'file', icon: 'text', size: '2 Ko' },
          'Guide Utilisateur.pdf': { type: 'file', icon: 'text', size: '156 Ko' },
          'Notes de cours': {
            type: 'folder',
            children: {
              'Chapitre 1.docx': { type: 'file', icon: 'text', size: '45 Ko' },
              'Chapitre 2.docx': { type: 'file', icon: 'text', size: '52 Ko' },
            }
          },
          'Projets': {
            type: 'folder',
            children: {
              'Projet Final.pptx': { type: 'file', icon: 'text', size: '2.3 Mo' },
            }
          }
        }
      },
      'Images': {
        type: 'folder',
        children: {
          'Captures': {
            type: 'folder',
            children: {
              'Capture_001.png': { type: 'file', icon: 'image', size: '450 Ko' },
              'Capture_002.png': { type: 'file', icon: 'image', size: '380 Ko' },
            }
          },
          'Wallpapers': {
            type: 'folder',
            children: {
              'Windows11_Dark.jpg': { type: 'file', icon: 'image', size: '1.2 Mo' },
              'Abstract_Blue.jpg': { type: 'file', icon: 'image', size: '890 Ko' },
            }
          },
          'Photo_profil.jpg': { type: 'file', icon: 'image', size: '256 Ko' },
        }
      },
      'Téléchargements': {
        type: 'folder',
        children: {
          'Setup_App.exe': { type: 'file', icon: 'file', size: '45.6 Mo' },
          'Document_Important.pdf': { type: 'file', icon: 'text', size: '1.8 Mo' },
          'Archive.zip': { type: 'file', icon: 'file', size: '23.4 Mo' },
        }
      },
      'Musique': {
        type: 'folder',
        children: {
          'Playlist': {
            type: 'folder',
            children: {
              'Track_01.mp3': { type: 'file', icon: 'music', size: '4.5 Mo' },
              'Track_02.mp3': { type: 'file', icon: 'music', size: '5.2 Mo' },
            }
          }
        }
      },
      'Vidéos': {
        type: 'folder',
        children: {
          'Tutoriels': {
            type: 'folder',
            children: {
              'Introduction.mp4': { type: 'file', icon: 'video', size: '125 Mo' },
            }
          }
        }
      }
    }
  }
};

const getIcon = (type) => {
  const icons = {
    folder: Folder,
    text: FileText,
    image: Image,
    music: Music,
    video: Video,
    file: File,
    drive: HardDrive,
  };
  return icons[type] || File;
};

export const FileExplorer = ({ initialPath = '' }) => {
  const { currentUser } = useOS();
  const [currentPath, setCurrentPath] = useState(initialPath ? ['Ce PC', initialPath] : ['Ce PC']);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([['Ce PC']]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const isReadOnly = currentUser?.role !== 'admin';

  // Navigate to path
  const getCurrentFolder = () => {
    let current = fileSystem;
    for (const segment of currentPath) {
      if (current[segment]) {
        current = current[segment].children || current[segment];
      } else if (current.children && current.children[segment]) {
        current = current.children[segment].children || current.children[segment];
      }
    }
    return current || {};
  };

  const navigateTo = (folderName) => {
    const newPath = [...currentPath, folderName];
    setCurrentPath(newPath);
    const newHistory = [...history.slice(0, historyIndex + 1), newPath];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const goUp = () => {
    if (currentPath.length > 1) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      const newHistory = [...history.slice(0, historyIndex + 1), newPath];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const goToRoot = () => {
    setCurrentPath(['Ce PC']);
    const newHistory = [...history.slice(0, historyIndex + 1), ['Ce PC']];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const currentFolder = getCurrentFolder();
  const items = Object.entries(currentFolder).filter(([name]) => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-testid="file-explorer" className="flex flex-col h-full bg-[#1a1a1a] text-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-[#2d2d2d] border-b border-white/5">
        <button 
          data-testid="explorer-back"
          onClick={goBack}
          disabled={historyIndex === 0}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          data-testid="explorer-forward"
          onClick={goForward}
          disabled={historyIndex === history.length - 1}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button 
          data-testid="explorer-up"
          onClick={goUp}
          disabled={currentPath.length <= 1}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* Breadcrumb */}
        <div className="flex-1 flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] rounded border border-white/10">
          <button onClick={goToRoot} className="hover:text-[#60CDFF] transition-colors">
            <HomeIcon className="w-4 h-4" />
          </button>
          {currentPath.map((segment, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-3 h-3 text-white/40" />
              <button 
                onClick={() => {
                  const newPath = currentPath.slice(0, index + 1);
                  setCurrentPath(newPath);
                }}
                className="text-sm hover:text-[#60CDFF] transition-colors"
              >
                {segment}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-48">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            data-testid="explorer-search"
            type="text"
            placeholder="Rechercher"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:border-[#60CDFF] transition-colors"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-0.5 border border-white/10 rounded overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-white/10' : 'hover:bg-white/5'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-white/10' : 'hover:bg-white/5'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-white/5 p-2 overflow-y-auto">
          <div className="space-y-1">
            <button 
              onClick={goToRoot}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 transition-colors text-sm"
            >
              <HardDrive className="w-4 h-4 text-white/70" />
              <span>Ce PC</span>
            </button>
            {Object.keys(fileSystem['Ce PC'].children || {}).map((folder) => (
              <button
                key={folder}
                onClick={() => setCurrentPath(['Ce PC', folder])}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 transition-colors text-sm ${
                  currentPath[1] === folder ? 'bg-white/10' : ''
                }`}
              >
                <Folder className="w-4 h-4 text-[#FFD966]" />
                <span>{folder}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {isReadOnly && (
            <div className="mb-4 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-sm">
              Mode lecture seule - Vous ne pouvez pas modifier les fichiers
            </div>
          )}

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40">
              <Folder className="w-16 h-16 mb-4" />
              <p>Ce dossier est vide</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-6 gap-2">
              {items.map(([name, item]) => {
                const IconComponent = item.type === 'folder' ? Folder : getIcon(item.icon);
                const isFolder = item.type === 'folder';
                return (
                  <button
                    key={name}
                    data-testid={`explorer-item-${name.replace(/\s+/g, '-')}`}
                    onDoubleClick={() => isFolder && navigateTo(name)}
                    className="flex flex-col items-center gap-1 p-3 rounded hover:bg-white/10 transition-colors group"
                  >
                    <IconComponent 
                      className={`w-10 h-10 ${isFolder ? 'text-[#FFD966]' : 'text-white/70'}`} 
                      strokeWidth={1.5} 
                    />
                    <span className="text-xs text-center line-clamp-2">{name}</span>
                    {item.size && (
                      <span className="text-xs text-white/40">{item.size}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-0.5">
              {/* Header */}
              <div className="flex items-center px-2 py-1 text-xs text-white/50 border-b border-white/10">
                <span className="flex-1">Nom</span>
                <span className="w-24">Type</span>
                <span className="w-20 text-right">Taille</span>
              </div>
              {items.map(([name, item]) => {
                const IconComponent = item.type === 'folder' ? Folder : getIcon(item.icon);
                const isFolder = item.type === 'folder';
                return (
                  <button
                    key={name}
                    data-testid={`explorer-item-${name.replace(/\s+/g, '-')}`}
                    onDoubleClick={() => isFolder && navigateTo(name)}
                    className="w-full flex items-center px-2 py-1.5 rounded hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex-1 flex items-center gap-2">
                      <IconComponent 
                        className={`w-5 h-5 ${isFolder ? 'text-[#FFD966]' : 'text-white/70'}`} 
                        strokeWidth={1.5} 
                      />
                      <span className="text-sm">{name}</span>
                    </div>
                    <span className="w-24 text-sm text-white/50">
                      {isFolder ? 'Dossier' : 'Fichier'}
                    </span>
                    <span className="w-20 text-sm text-white/50 text-right">
                      {item.size || '-'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#2d2d2d] border-t border-white/5 text-xs text-white/50">
        <span>{items.length} élément{items.length > 1 ? 's' : ''}</span>
        <span>{currentPath.join(' > ')}</span>
      </div>
    </div>
  );
};
