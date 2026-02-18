import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../../context/OSContext';

const COMMANDS = {
  help: () => `
Commandes disponibles:
  help      - Affiche cette aide
  cls       - Efface l'écran
  clear     - Efface l'écran
  dir       - Liste les fichiers du répertoire courant
  cd [dir]  - Change de répertoire
  echo [t]  - Affiche le texte
  time      - Affiche l'heure actuelle
  date      - Affiche la date actuelle
  whoami    - Affiche l'utilisateur actuel
  ver       - Affiche la version du système
  color     - Change la couleur du texte
  exit      - Ferme le terminal
`,
  cls: () => 'CLEAR',
  clear: () => 'CLEAR',
  dir: () => `
 Répertoire de C:\\Users\\Utilisateur

 22/01/2026  10:30    <DIR>          .
 22/01/2026  10:30    <DIR>          ..
 22/01/2026  09:15    <DIR>          Documents
 22/01/2026  09:15    <DIR>          Images
 22/01/2026  09:15    <DIR>          Téléchargements
 22/01/2026  09:15    <DIR>          Musique
 22/01/2026  09:15    <DIR>          Vidéos
 22/01/2026  10:30             2,048 readme.txt
               1 fichier(s)            2,048 octets
               7 Rép(s)  125,458,432,000 octets libres
`,
  time: () => `L'heure actuelle est: ${new Date().toLocaleTimeString('fr-FR')}`,
  date: () => `La date du jour est: ${new Date().toLocaleDateString('fr-FR')}`,
  ver: () => `
Microsoft Windows [Version 11.0.22000.0]
(c) Microsoft Corporation. Tous droits réservés.
[SIMULATION]
`,
  cd: (args) => {
    if (!args || args === '..') return '';
    return `Le système ne peut pas trouver le chemin spécifié.`;
  },
  echo: (args) => args || '',
  color: () => 'La couleur a été changée.',
  exit: () => 'EXIT',
};

export const CMD = () => {
  const { currentUser, closeWindow } = useOS();
  const [history, setHistory] = useState([
    { type: 'output', text: 'Microsoft Windows [Version 11.0.22000.0]' },
    { type: 'output', text: '(c) Microsoft Corporation. Tous droits réservés.' },
    { type: 'output', text: '[SIMULATION Windows 11 Terminal]' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const processCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    // Add to command history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Add prompt to output
    setHistory((prev) => [
      ...prev,
      { type: 'prompt', text: `C:\\Users\\${currentUser?.username || 'Utilisateur'}> ${trimmed}` },
    ]);

    // Execute command
    if (command === 'whoami') {
      setHistory((prev) => [
        ...prev,
        { type: 'output', text: `${currentUser?.username || 'Utilisateur'} (${currentUser?.role || 'user'})` },
      ]);
      return;
    }

    if (COMMANDS[command]) {
      const result = COMMANDS[command](args);
      if (result === 'CLEAR') {
        setHistory([]);
      } else if (result === 'EXIT') {
        closeWindow('cmd');
      } else if (result) {
        setHistory((prev) => [...prev, { type: 'output', text: result }]);
      }
    } else {
      setHistory((prev) => [
        ...prev,
        { type: 'error', text: `'${command}' n'est pas reconnu comme une commande interne ou externe.` },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processCommand(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex] || '');
        }
      }
    }
  };

  return (
    <div 
      data-testid="cmd-terminal"
      className="h-full bg-black text-white font-mono text-sm p-2 overflow-hidden flex flex-col cursor-text"
      onClick={handleFocus}
    >
      {/* Output */}
      <div ref={outputRef} className="flex-1 overflow-y-auto whitespace-pre-wrap">
        {history.map((item, index) => (
          <div 
            key={index} 
            className={
              item.type === 'error' ? 'text-red-400' : 
              item.type === 'prompt' ? 'text-white' : 
              'text-gray-300'
            }
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center shrink-0">
        <span className="text-white">C:\Users\{currentUser?.username || 'Utilisateur'}&gt;&nbsp;</span>
        <input
          ref={inputRef}
          data-testid="cmd-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white caret-white"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
};
