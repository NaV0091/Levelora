import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Key, Database, Globe, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getFirebaseConfig, 
  saveCustomFirebaseConfig, 
  clearCustomFirebaseConfig, 
  type FirebaseAppConfig 
} from '../../services/firebaseConfig';
import { PandaMascot } from '../common/PandaMascot';

export const FirebaseConfigModal: React.FC = () => {
  const { isConfigModalOpen, setIsConfigModalOpen, isLiveFirebase } = useAuth();
  const currentConfig = getFirebaseConfig();

  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain || '');
  const [projectId, setProjectId] = useState(currentConfig.projectId || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(currentConfig.appId || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isConfigModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: FirebaseAppConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    saveCustomFirebaseConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleReset = () => {
    clearCustomFirebaseConfig();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#253d26] border border-white/20 p-6 text-[#FFF5E8] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsConfigModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF5E8] transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A7B89A] to-[#F5E6A8] p-1 flex items-center justify-center shadow-md">
            <PandaMascot pose="bamboo" size={38} animated />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#FFF5E8]">Firebase Connection</h2>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isLiveFirebase
                    ? 'bg-[#A7B89A] text-[#29452B]'
                    : 'bg-[#F5E6A8] text-[#29452B]'
                }`}
              >
                {isLiveFirebase ? 'Live Firebase Active' : 'Demo / Local Mode'}
              </span>
            </div>
            <p className="text-xs text-[#DCE8D2]">
              Connect your Firebase Project for live Cloud Auth & Firestore sync
            </p>
          </div>
        </div>

        {/* Status Notice */}
        <div className="mb-4 p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-[#DCE8D2] space-y-1.5 leading-relaxed">
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="text-[#F5E6A8] shrink-0 mt-0.5" />
            <p>
              {isLiveFirebase
                ? 'Your app is actively syncing authentication and saved data with Google Firebase!'
                : 'Currently running with zero-setup local persistent mode. You can drop in your Firebase Project keys below or into frontend/.env to enable live Google Firebase Cloud!'}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-2xl bg-[#A7B89A]/30 border border-[#A7B89A] text-xs font-bold text-[#DCE8D2] flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#A7B89A]" />
            Configuration saved! Reloading application...
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#DCE8D2] mb-1 flex items-center gap-1.5">
              <Key size={13} className="text-[#F6B8A8]" />
              API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/25 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#DCE8D2] mb-1 flex items-center gap-1.5">
                <Globe size={13} className="text-[#A7B89A]" />
                Auth Domain
              </label>
              <input
                type="text"
                value={authDomain}
                onChange={e => setAuthDomain(e.target.value)}
                placeholder="project-id.firebaseapp.com"
                className="w-full px-3.5 py-2 rounded-xl bg-black/25 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#DCE8D2] mb-1 flex items-center gap-1.5">
                <Database size={13} className="text-[#F5E6A8]" />
                Project ID
              </label>
              <input
                type="text"
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                placeholder="levelora-rpg"
                className="w-full px-3.5 py-2 rounded-xl bg-black/25 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#DCE8D2] mb-1">Storage Bucket</label>
              <input
                type="text"
                value={storageBucket}
                onChange={e => setStorageBucket(e.target.value)}
                placeholder="project-id.appspot.com"
                className="w-full px-3.5 py-2 rounded-xl bg-black/25 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#DCE8D2] mb-1">Messaging Sender ID</label>
              <input
                type="text"
                value={messagingSenderId}
                onChange={e => setMessagingSenderId(e.target.value)}
                placeholder="123456789012"
                className="w-full px-3.5 py-2 rounded-xl bg-black/25 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#DCE8D2] mb-1">App ID</label>
            <input
              type="text"
              value={appId}
              onChange={e => setAppId(e.target.value)}
              placeholder="1:123456789:web:abcdef..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/25 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs font-bold text-[#DCE8D2] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} />
              Reset to .env
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] hover:brightness-105 active:scale-95 text-[#29452B] font-black text-xs shadow-md transition-all cursor-pointer"
            >
              Save & Apply Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
