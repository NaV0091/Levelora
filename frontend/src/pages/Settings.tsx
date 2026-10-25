import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle,
  User,
  Monitor,
  LogOut,
  Database
} from 'lucide-react';
import { useLevelora } from '../context/LeveloraContext';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';

export const Settings: React.FC = () => {
  const { state, updateProfile, updateSettings, resetAllProgress } = useLevelora();
  const { user, signOut, isLiveFirebase, setIsConfigModalOpen } = useAuth();

  const [nameInput, setNameInput] = useState(state.profile.username);
  const [goalInput, setGoalInput] = useState(state.settings.dailyGoalQuests || 5);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateProfile({ username: nameInput.trim() });
    }
    updateSettings({ dailyGoalQuests: Number(goalInput) || 5 });
  };

  const handleExport = () => {
    const dataStr = StorageService.exportData(state);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `levelora-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const imported = StorageService.importData(content);
      if (imported) {
        setImportStatus('Data successfully restored! Refreshing...');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setImportStatus('Invalid backup file. Could not restore.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 text-[#FFF5E8] pb-12 max-w-4xl">
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-[#FFF5E8] tracking-tight flex items-center gap-2">
          <SettingsIcon size={24} className="text-[#A7B89A]" />
          Settings &amp; Preferences
        </h1>
        <p className="text-xs text-[#DCE8D2] mt-0.5 font-medium">
          Personalize your LEVELORA experience, audio ambiance, goals, and safe data backups.
        </p>
      </div>

      {/* Profile & Identity Settings */}
      <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <User size={18} className="text-[#F6B8A8]" />
          <h2 className="text-sm font-extrabold text-[#FFF5E8]">Adventurer Profile</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#DCE8D2] mb-1">Display Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#DCE8D2] mb-1">Daily Quest Target</label>
              <input
                type="number"
                min="1"
                max="20"
                value={goalInput}
                onChange={e => setGoalInput(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] text-[#29452B] font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            Save Profile Settings
          </button>
        </form>
      </div>

      {/* Experience & Audio Controls */}
      <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <Sparkles size={18} className="text-[#F5E6A8]" />
          <h2 className="text-sm font-extrabold text-[#FFF5E8]">Audio &amp; Visual Experience</h2>
        </div>

        <div className="space-y-3">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center text-[#F5E6A8]">
                {state.settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#FFF5E8]">Cozy Chime Sound Effects</h4>
                <p className="text-[10px] text-[#A7B89A]">Synthesized harmonic bells on quest completions and level ups</p>
              </div>
            </div>

            <button
              onClick={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                state.settings.soundEnabled ? 'bg-[#74865B] justify-end' : 'bg-black/40 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Animation Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center text-[#A7B89A]">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#FFF5E8]">Confetti &amp; Micro-Animations</h4>
                <p className="text-[10px] text-[#A7B89A]">Playful celebratory visual bursts during level ups</p>
              </div>
            </div>

            <button
              onClick={() => updateSettings({ animationsEnabled: !state.settings.animationsEnabled })}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                state.settings.animationsEnabled ? 'bg-[#74865B] justify-end' : 'bg-black/40 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Display Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center text-[#DCE8D2]">
                <Monitor size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#FFF5E8]">Studio Frame Presentation</h4>
                <p className="text-[10px] text-[#A7B89A]">Show the framed cozy laptop view matching the reference design</p>
              </div>
            </div>

            <button
              onClick={() => updateSettings({
                displayMode: state.settings.displayMode === 'frame' ? 'fullscreen' : 'frame'
              })}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                state.settings.displayMode === 'frame' ? 'bg-[#74865B] justify-end' : 'bg-black/40 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Account & Authentication */}
      <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <User size={18} className="text-[#F6B8A8]" />
            <h2 className="text-sm font-extrabold text-[#FFF5E8]">Adventurer Account &amp; Cloud Sync</h2>
          </div>
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-[#DCE8D2] transition-colors cursor-pointer"
          >
            <Database size={13} />
            <span>Firebase Config</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10">
            <span className="text-[10px] font-bold text-[#A7B89A] uppercase tracking-wider block">
              Signed-in Adventurer
            </span>
            <p className="text-sm font-black text-[#FFF5E8] mt-0.5">
              {state.profile.username || 'Adventurer'}
            </p>
            <p className="text-xs text-[#DCE8D2]/80 mt-0.5 font-mono">
              {user?.email || 'Local Adventurer Session'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#A7B89A] uppercase tracking-wider block">
                Sync Engine Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isLiveFirebase ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="text-xs font-black text-[#FFF5E8]">
                  {isLiveFirebase ? 'Firebase Live Cloud Active' : 'User-Scoped Local & Cloud Sync Ready'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#A7B89A] mt-2">
              All your progress is saved per user and restored every time you sign in!
            </p>
          </div>
        </div>

        {user && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={async () => {
                await signOut();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-200 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              Sign Out of Levelora
            </button>
          </div>
        )}
      </div>

      {/* Data Management & Backup */}
      <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <ShieldCheck size={18} className="text-[#A7B89A]" />
          <h2 className="text-sm font-extrabold text-[#FFF5E8]">Data Storage &amp; Privacy</h2>
        </div>

        <p className="text-xs text-[#DCE8D2]/80 leading-relaxed mb-4">
          All your quests, XP history, habits, and attributes are safely saved and tied to your adventurer account.
        </p>

        {importStatus && (
          <div className="p-3 mb-4 rounded-xl bg-black/30 text-xs font-semibold text-[#F5E6A8]">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/20 text-xs font-bold text-[#FFF5E8] transition-colors cursor-pointer"
          >
            <Download size={14} /> Export Backup (JSON)
          </button>

          <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/20 text-xs font-bold text-[#FFF5E8] transition-colors cursor-pointer">
            <Upload size={14} /> Restore Backup
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-200 transition-colors ml-auto cursor-pointer"
          >
            <RotateCcw size={14} /> Reset Demo Data
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-[#FFF5E8] p-6 text-center text-[#29452B] shadow-2xl border-2 border-red-300">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-extrabold">Reset all progress?</h3>
            <p className="text-xs text-[#687463] mt-1 leading-relaxed">
              This will restore all quests, habits, XP, and attributes back to the initial cozy starter state.
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-full hover:bg-black/10 text-xs font-bold text-[#687463] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllProgress();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
