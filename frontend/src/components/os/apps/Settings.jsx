import React, { useState } from 'react';
import { 
  Monitor, 
  Palette, 
  Image, 
  RotateCcw,
  Check,
  Smartphone,
  MonitorSmartphone
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';

const wallpapers = [
  { id: 'default', name: 'Windows 11 Bloom', url: 'https://images.pexels.com/photos/28428587/pexels-photo-28428587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: 'abstract-blue', name: 'Abstrait Bleu', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80' },
  { id: 'gradient-purple', name: 'Dégradé Violet', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80' },
  { id: 'nature', name: 'Nature', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80' },
  { id: 'dark-minimal', name: 'Sombre Minimal', url: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1920&q=80' },
  { id: 'city', name: 'Ville Nocturne', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80' },
];

const accentColors = [
  { id: 'blue', name: 'Bleu', color: '#60CDFF' },
  { id: 'purple', name: 'Violet', color: '#B146C2' },
  { id: 'red', name: 'Rouge', color: '#FF4D4F' },
  { id: 'orange', name: 'Orange', color: '#FF8C00' },
  { id: 'green', name: 'Vert', color: '#6CCB5F' },
  { id: 'teal', name: 'Sarcelle', color: '#00B7C3' },
];

export const Settings = () => {
  const { settings, updateSettings, addNotification } = useOS();
  const [activeSection, setActiveSection] = useState('display');

  const handleWallpaperChange = (wallpaper) => {
    updateSettings({ wallpaper: wallpaper.url });
    addNotification({ type: 'success', title: 'Fond d\'écran', message: `Fond d'écran changé : ${wallpaper.name}` });
  };

  const handleAccentColorChange = (color) => {
    updateSettings({ accentColor: color.color });
    addNotification({ type: 'success', title: 'Couleur d\'accentuation', message: `Couleur changée : ${color.name}` });
  };

  const handleOrientationChange = (orientation) => {
    updateSettings({ orientation });
    addNotification({ 
      type: 'info', 
      title: 'Orientation', 
      message: `Mode ${orientation === 'landscape' ? 'paysage' : 'portrait'} activé` 
    });
  };

  const handleResetSettings = () => {
    updateSettings({
      wallpaper: wallpapers[0].url,
      accentColor: '#60CDFF',
      orientation: 'landscape',
    });
    addNotification({ type: 'success', title: 'Paramètres', message: 'Paramètres réinitialisés' });
  };

  const sections = [
    { id: 'display', label: 'Affichage', icon: Monitor },
    { id: 'personalization', label: 'Personnalisation', icon: Palette },
  ];

  return (
    <div data-testid="settings-app" className="flex h-full bg-[#1a1a1a] text-white">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/5 p-4 bg-[#202020]">
        <h2 className="text-lg font-semibold mb-4">Paramètres</h2>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              data-testid={`settings-section-${section.id}`}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeSection === section.id
                  ? 'bg-[#60CDFF]/20 text-[#60CDFF]'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <section.icon className="w-5 h-5" strokeWidth={1.5} />
              {section.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            data-testid="reset-settings-btn"
            onClick={handleResetSettings}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeSection === 'display' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-semibold mb-2">Affichage</h1>
              <p className="text-white/60 text-sm">Gérez l'orientation et l'affichage de votre écran</p>
            </div>

            {/* Orientation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Orientation de l'écran</h3>
              <p className="text-sm text-white/50">Choisissez entre le mode paysage (recommandé) ou portrait</p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  data-testid="orientation-landscape"
                  onClick={() => handleOrientationChange('landscape')}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    settings.orientation === 'landscape'
                      ? 'border-[#60CDFF] bg-[#60CDFF]/10'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-white/60" />
                    </div>
                    <span className="text-sm font-medium">Paysage</span>
                    <span className="text-xs text-white/50">Recommandé</span>
                  </div>
                  {settings.orientation === 'landscape' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#60CDFF] flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                </button>

                <button
                  data-testid="orientation-portrait"
                  onClick={() => handleOrientationChange('portrait')}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    settings.orientation === 'portrait'
                      ? 'border-[#60CDFF] bg-[#60CDFF]/10'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-20 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white/60" />
                    </div>
                    <span className="text-sm font-medium">Portrait</span>
                    <span className="text-xs text-white/50">Mobile</span>
                  </div>
                  {settings.orientation === 'portrait' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#60CDFF] flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-[#60CDFF]/10 border border-[#60CDFF]/20 rounded-lg p-4 max-w-md">
              <div className="flex items-start gap-3">
                <MonitorSmartphone className="w-5 h-5 text-[#60CDFF] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Mode adaptatif</p>
                  <p className="text-xs text-white/60 mt-1">
                    L'interface s'adapte automatiquement à l'orientation choisie. Le mode paysage est recommandé pour une meilleure expérience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'personalization' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-semibold mb-2">Personnalisation</h1>
              <p className="text-white/60 text-sm">Personnalisez l'apparence de votre bureau</p>
            </div>

            {/* Wallpaper */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Image className="w-5 h-5" />
                Fond d'écran
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    data-testid={`wallpaper-${wp.id}`}
                    onClick={() => handleWallpaperChange(wp)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      settings.wallpaper === wp.url
                        ? 'border-[#60CDFF] ring-2 ring-[#60CDFF]/30'
                        : 'border-transparent hover:border-white/20'
                    }`}
                  >
                    <img 
                      src={wp.url} 
                      alt={wp.name}
                      className="w-full h-full object-cover"
                    />
                    {settings.wallpaper === wp.url && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#60CDFF] flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <span className="text-xs text-white">{wp.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Couleur d'accentuation
              </h3>
              <div className="flex gap-3 flex-wrap">
                {accentColors.map((color) => (
                  <button
                    key={color.id}
                    data-testid={`accent-color-${color.id}`}
                    onClick={() => handleAccentColorChange(color)}
                    className={`relative w-12 h-12 rounded-full transition-transform hover:scale-110 ${
                      settings.accentColor === color.color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a]' : ''
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  >
                    {settings.accentColor === color.color && (
                      <Check className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
