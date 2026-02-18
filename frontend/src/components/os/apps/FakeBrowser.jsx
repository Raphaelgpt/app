import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Home, 
  Star, 
  Shield,
  Search,
  MoreVertical
} from 'lucide-react';

export const FakeBrowser = () => {
  const [url, setUrl] = useState('https://www.exemple.com');
  const [currentPage, setCurrentPage] = useState('home');

  const pages = {
    home: {
      title: 'Bienvenue',
      content: (
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-light mb-6 text-white">Bienvenue sur le Navigateur</h1>
          <p className="text-white/70 mb-8 text-lg">
            Ceci est une simulation de navigateur web pour la démonstration Windows 11.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {['Formation', 'Documentation', 'Support'].map((item) => (
              <button 
                key={item}
                onClick={() => setCurrentPage(item.toLowerCase())}
                className="p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left"
              >
                <h3 className="text-lg font-medium text-white mb-2">{item}</h3>
                <p className="text-sm text-white/50">Accéder à la section {item.toLowerCase()}</p>
              </button>
            ))}
          </div>

          <div className="bg-[#60CDFF]/10 border border-[#60CDFF]/20 rounded-xl p-6">
            <h2 className="text-xl font-medium text-white mb-3">Raccourcis favoris</h2>
            <div className="flex gap-4">
              {['Google', 'YouTube', 'GitHub', 'Stack Overflow'].map((site) => (
                <button 
                  key={site}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                >
                  {site}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    formation: {
      title: 'Formation',
      content: (
        <div className="p-8 max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentPage('home')} 
            className="flex items-center gap-2 text-[#60CDFF] mb-6 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Retour
          </button>
          <h1 className="text-3xl font-light mb-6 text-white">Centre de Formation</h1>
          <div className="space-y-4">
            {[
              { title: 'Introduction à Windows 11', duration: '15 min' },
              { title: 'Gestion des utilisateurs', duration: '20 min' },
              { title: 'Administration système', duration: '30 min' },
              { title: 'Sécurité et bonnes pratiques', duration: '25 min' },
            ].map((course, i) => (
              <div key={i} className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">{course.title}</h3>
                  <p className="text-sm text-white/50">Durée: {course.duration}</p>
                </div>
                <button className="px-4 py-2 bg-[#60CDFF] text-black rounded text-sm font-medium hover:bg-[#4CC2FF] transition-colors">
                  Commencer
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    },
    documentation: {
      title: 'Documentation',
      content: (
        <div className="p-8 max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentPage('home')} 
            className="flex items-center gap-2 text-[#60CDFF] mb-6 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Retour
          </button>
          <h1 className="text-3xl font-light mb-6 text-white">Documentation</h1>
          <div className="prose prose-invert max-w-none">
            <div className="p-6 bg-white/5 rounded-lg mb-6">
              <h2 className="text-xl text-white mb-4">Guide de démarrage rapide</h2>
              <ol className="list-decimal list-inside space-y-2 text-white/70">
                <li>Connectez-vous avec vos identifiants</li>
                <li>Explorez le bureau Windows 11</li>
                <li>Utilisez le menu Démarrer pour accéder aux applications</li>
                <li>Les administrateurs ont accès au Panneau de configuration</li>
              </ol>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
              <h2 className="text-xl text-white mb-4">Commandes Terminal</h2>
              <code className="block p-4 bg-black/40 rounded text-[#60CDFF] text-sm">
                help - Affiche l'aide<br/>
                dir - Liste les fichiers<br/>
                cls - Efface l'écran<br/>
                echo [texte] - Affiche du texte<br/>
                time - Affiche l'heure<br/>
                date - Affiche la date
              </code>
            </div>
          </div>
        </div>
      )
    },
    support: {
      title: 'Support',
      content: (
        <div className="p-8 max-w-4xl mx-auto">
          <button 
            onClick={() => setCurrentPage('home')} 
            className="flex items-center gap-2 text-[#60CDFF] mb-6 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Retour
          </button>
          <h1 className="text-3xl font-light mb-6 text-white">Support Technique</h1>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-lg">
              <h2 className="text-xl text-white mb-4">Contact</h2>
              <p className="text-white/70 mb-4">
                Pour toute question, contactez l'administrateur système.
              </p>
              <p className="text-white/50 text-sm">
                Email: admin@simulation.local<br/>
                Téléphone: +33 1 23 45 67 89
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
              <h2 className="text-xl text-white mb-4">FAQ</h2>
              <div className="space-y-2 text-sm">
                <details className="text-white/70">
                  <summary className="cursor-pointer hover:text-white">Comment changer mon mot de passe?</summary>
                  <p className="mt-2 pl-4 text-white/50">Contactez un administrateur.</p>
                </details>
                <details className="text-white/70">
                  <summary className="cursor-pointer hover:text-white">J'ai oublié mes identifiants</summary>
                  <p className="mt-2 pl-4 text-white/50">Adressez-vous au support technique.</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const handleNavigate = (e) => {
    e.preventDefault();
    setCurrentPage('home');
  };

  return (
    <div data-testid="fake-browser" className="flex flex-col h-full bg-[#1a1a1a] text-white">
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 p-2 bg-[#2d2d2d] border-b border-white/5">
        {/* Navigation buttons */}
        <div className="flex items-center gap-0.5">
          <button className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCurrentPage('home')}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* URL bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] rounded-full border border-white/10 focus-within:border-[#60CDFF] transition-colors">
            <Shield className="w-4 h-4 text-white/40" />
            <input
              data-testid="browser-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
              placeholder="Rechercher ou entrer une URL"
            />
            <Search className="w-4 h-4 text-white/40" />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <Star className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-[#252525] border-b border-white/5">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2d2d2d] rounded-t text-sm">
          <span>{pages[currentPage]?.title || 'Nouvelle page'}</span>
          <button className="p-0.5 rounded hover:bg-white/10">×</button>
        </div>
        <button className="p-1 rounded hover:bg-white/10 text-white/50 text-lg">+</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
        {pages[currentPage]?.content || (
          <div className="flex items-center justify-center h-full text-white/50">
            Page non trouvée
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3 py-1 bg-[#2d2d2d] border-t border-white/5 text-xs text-white/50">
        Simulation - Navigation sécurisée
      </div>
    </div>
  );
};
