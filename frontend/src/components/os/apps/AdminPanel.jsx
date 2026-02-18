import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  FileText, 
  Terminal, 
  Radio,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminPanel = () => {
  const { currentUser, addNotification, checkBroadcast } = useOS();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // User form state
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'user' });

  // Broadcast state
  const [broadcastForm, setBroadcastForm] = useState({ title: 'Alerte Système', message: '' });

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/users`);
      setUsers(res.data);
    } catch (e) {
      console.error('Error fetching users:', e);
    }
    setLoading(false);
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/logs`);
      setLogs(res.data);
    } catch (e) {
      console.error('Error fetching logs:', e);
    }
    setLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API}/users/${editingUser.id}`, userForm);
        addNotification({ type: 'success', message: 'Utilisateur modifié' });
      } else {
        await axios.post(`${API}/users`, userForm);
        addNotification({ type: 'success', message: 'Utilisateur créé' });
      }
      setShowUserForm(false);
      setEditingUser(null);
      setUserForm({ username: '', password: '', role: 'user' });
      fetchUsers();
    } catch (e) {
      addNotification({ type: 'error', message: e.response?.data?.detail || 'Erreur' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await axios.delete(`${API}/users/${userId}`);
      addNotification({ type: 'success', message: 'Utilisateur supprimé' });
      fetchUsers();
    } catch (e) {
      addNotification({ type: 'error', message: e.response?.data?.detail || 'Erreur' });
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({ username: user.username, password: '', role: user.role });
    setShowUserForm(true);
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Effacer tous les journaux ?')) return;
    try {
      await axios.delete(`${API}/logs`);
      addNotification({ type: 'success', message: 'Journaux effacés' });
      fetchLogs();
    } catch (e) {
      addNotification({ type: 'error', message: 'Erreur lors de la suppression' });
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.message.trim()) {
      addNotification({ type: 'error', message: 'Veuillez entrer un message' });
      return;
    }
    try {
      await axios.post(`${API}/broadcast?created_by=${currentUser.username}`, broadcastForm);
      addNotification({ type: 'success', message: 'Broadcast envoyé' });
      setBroadcastForm({ title: 'Alerte Système', message: '' });
      checkBroadcast();
    } catch (e) {
      addNotification({ type: 'error', message: 'Erreur lors de l\'envoi' });
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full text-white/50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <p className="text-lg">Accès refusé</p>
          <p className="text-sm text-white/40">Cette section est réservée aux administrateurs</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'logs', label: 'Journaux', icon: FileText },
    { id: 'broadcast', label: 'Broadcast', icon: Radio },
  ];

  return (
    <div data-testid="admin-panel" className="flex h-full bg-[#1a1a1a] text-white">
      {/* Sidebar */}
      <div className="w-52 border-r border-white/5 p-2 bg-[#202020]">
        <h2 className="px-3 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
          Administration
        </h2>
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-testid={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#60CDFF]/20 text-[#60CDFF]'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold">Gestion des utilisateurs</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchUsers}
                  className="p-2 rounded hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  data-testid="add-user-btn"
                  onClick={() => {
                    setEditingUser(null);
                    setUserForm({ username: '', password: '', role: 'user' });
                    setShowUserForm(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#60CDFF] text-black rounded text-sm font-medium hover:bg-[#4CC2FF] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
            </div>

            {/* User Form Modal */}
            {showUserForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#2d2d2d] rounded-xl p-6 w-96 border border-white/10">
                  <h2 className="text-lg font-semibold mb-4">
                    {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                  </h2>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Nom d'utilisateur</label>
                      <input
                        data-testid="user-form-username"
                        type="text"
                        value={userForm.username}
                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-[#60CDFF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-1">
                        Mot de passe {editingUser && '(laisser vide pour garder l\'actuel)'}
                      </label>
                      <input
                        data-testid="user-form-password"
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-[#60CDFF]"
                        required={!editingUser}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Rôle</label>
                      <select
                        data-testid="user-form-role"
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-[#60CDFF]"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowUserForm(false)}
                        className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        data-testid="user-form-submit"
                        type="submit"
                        className="px-4 py-2 bg-[#60CDFF] text-black rounded font-medium hover:bg-[#4CC2FF] transition-colors"
                      >
                        {editingUser ? 'Modifier' : 'Créer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
              {/* Header */}
              <div className="grid grid-cols-4 gap-2 text-left text-sm text-white/50 border-b border-white/10 py-2 px-3 sticky top-0 bg-[#1a1a1a]">
                <span>Utilisateur</span>
                <span>Rôle</span>
                <span>Créé le</span>
                <span className="text-right">Actions</span>
              </div>
              {/* Rows */}
              <div className="divide-y divide-white/5">
                {users.map((user) => (
                  <div 
                    key={user.id} 
                    data-testid={`user-row-${user.username}`}
                    className="grid grid-cols-4 gap-2 items-center py-3 px-3 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        user.role === 'admin' ? 'bg-[#60CDFF]/20' : 'bg-white/10'
                      }`}>
                        <span className="text-sm">{user.role === 'admin' ? '👑' : '👤'}</span>
                      </div>
                      <span>{user.username}</span>
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        user.role === 'admin' 
                          ? 'bg-[#60CDFF]/20 text-[#60CDFF]' 
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                      </span>
                    </div>
                    <div className="text-white/50 text-sm">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        data-testid={`edit-user-${user.username}`}
                        onClick={() => handleEditUser(user)}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.username !== 'SuperAdmin' && (
                        <button
                          data-testid={`delete-user-${user.username}`}
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold">Journal des connexions</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLogs}
                  className="p-2 rounded hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  data-testid="clear-logs-btn"
                  onClick={handleClearLogs}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Effacer
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/40">
                  <Clock className="w-16 h-16 mb-4" />
                  <p>Aucun journal de connexion</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div 
                      key={log.id}
                      data-testid={`log-entry-${log.id}`}
                      className={`p-3 rounded-lg border ${
                        log.success 
                          ? 'bg-green-500/5 border-green-500/20' 
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            log.success ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            {log.success ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <X className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{log.username}</p>
                            <p className="text-xs text-white/50">
                              {log.success ? 'Connexion réussie' : 'Échec de connexion'}
                              {log.role && ` • ${log.role}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-white/50">
                          <p>{new Date(log.timestamp).toLocaleDateString('fr-FR')}</p>
                          <p>{new Date(log.timestamp).toLocaleTimeString('fr-FR')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Broadcast Tab */}
        {activeTab === 'broadcast' && (
          <div className="flex-1 p-4">
            <h1 className="text-xl font-semibold mb-4">Envoyer une notification système</h1>
            <p className="text-white/60 mb-6">
              Envoyez un message qui s'affichera en plein écran pour tous les utilisateurs connectés.
            </p>

            <form onSubmit={handleSendBroadcast} className="max-w-xl space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Titre</label>
                <input
                  data-testid="broadcast-title"
                  type="text"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-[#60CDFF]"
                  placeholder="Alerte Système"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Message</label>
                <textarea
                  data-testid="broadcast-message"
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-[#60CDFF] min-h-[120px] resize-none"
                  placeholder="Entrez votre message..."
                  required
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium">Attention</p>
                    <p className="text-sm text-white/60">
                      Ce message apparaîtra en plein écran et interrompra l'activité de tous les utilisateurs.
                    </p>
                  </div>
                </div>
              </div>

              <button
                data-testid="send-broadcast-btn"
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-[#60CDFF] text-black rounded font-medium hover:bg-[#4CC2FF] transition-colors"
              >
                <Radio className="w-4 h-4" />
                Envoyer la notification
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
