import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PandaMascot } from '../common/PandaMascot';

export const AuthModal: React.FC = () => {
  const { 
    user, 
    loading, 
    signIn, 
    signUp, 
    signInWithGoogle, 
    needsNamePrompt,
    setNeedsNamePrompt,
    updateAdventurerName
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adventurerName, setAdventurerName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For Google Sign-in Name Prompt
  const [promptNameInput, setPromptNameInput] = useState('');

  // If user is already authenticated and not in name prompt mode, don't show the modal
  if (!loading && user && !needsNamePrompt) {
    return null;
  }

  // Loading state while checking auth
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#213523] text-[#FFF5E8]">
        <div className="flex flex-col items-center gap-4 animate-pulse text-center p-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#A7B89A] to-[#F5E6A8] p-2 flex items-center justify-center shadow-xl">
            <PandaMascot pose="bamboo" size={48} animated />
          </div>
          <div>
            <h3 className="text-lg font-black font-outfit tracking-wide">LEVELORA RPG</h3>
            <p className="text-xs text-[#DCE8D2] mt-1 font-medium">Awakening your adventurer chronicles...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle Google user name customization step
  if (user && needsNamePrompt) {
    const handleSavePromptName = async (skip: boolean) => {
      const chosen = skip ? 'Adventurer' : (promptNameInput.trim() || 'Adventurer');
      await updateAdventurerName(chosen);
      setNeedsNamePrompt(false);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-sm rounded-3xl bg-[#253d26] border-2 border-[#A7B89A]/40 p-6 text-[#FFF5E8] shadow-2xl">
          <div className="text-center mb-5">
            <div className="inline-block p-2 rounded-2xl bg-[#FFF5E8]/10 mb-2 border border-white/15">
              <PandaMascot pose="waving" size={56} animated />
            </div>
            <h2 className="text-xl font-black tracking-tight text-[#FFF5E8]">
              Welcome, Adventurer!
            </h2>
            <p className="text-xs text-[#DCE8D2] mt-0.5">
              What name should we call you?
            </p>
          </div>

          <div className="space-y-3.5">
            <div>
              <input
                type="text"
                value={promptNameInput}
                onChange={e => setPromptNameInput(e.target.value)}
                placeholder="e.g. Robin (or leave blank)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
                autoFocus
              />
              <p className="text-[11px] text-[#A7B89A] mt-1 text-center">
                Leave blank or skip to be called <strong className="text-[#F5E6A8]">&ldquo;Adventurer&rdquo;</strong>.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSavePromptName(true)}
                className="flex-1 py-2.5 px-3 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 text-xs font-bold text-[#DCE8D2] transition-all cursor-pointer"
              >
                Skip
              </button>

              <button
                type="button"
                onClick={() => handleSavePromptName(false)}
                className="flex-1 py-2.5 px-3 rounded-full bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] hover:brightness-105 active:scale-95 text-xs font-black text-[#29452B] shadow-md transition-all cursor-pointer"
              >
                Save Name
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent, isSkippingName: boolean = false) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const finalName = isSkippingName ? 'Adventurer' : (adventurerName.trim() || 'Adventurer');
        const res = await signUp(email.trim(), password, finalName);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to sign up.');
        }
      } else {
        const res = await signIn(email.trim(), password);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to sign in.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to sign in with Google.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Clean Main Container Card */}
      <div className="relative w-full max-w-md my-auto rounded-3xl bg-[#253d26] border-2 border-white/15 p-6 sm:p-7 text-[#FFF5E8] shadow-2xl">
        
        {/* Mascot & Brand Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#A7B89A] to-[#F5E6A8] p-1 shadow-md mb-2">
            <PandaMascot pose={mode === 'signup' ? 'waving' : 'bamboo'} size={50} animated />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#FFF5E8] font-outfit">
            LEVELORA
          </h1>
          <p className="text-xs text-[#DCE8D2] mt-0.5">
            {mode === 'signup'
              ? 'Create your account to start leveling up your daily life!'
              : 'Welcome back! Sign in to continue your adventure.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-full bg-black/30 p-1 mb-5 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#F6B8A8] text-[#29452B] shadow-sm'
                : 'text-[#DCE8D2]/70 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#F6B8A8] text-[#29452B] shadow-sm'
                : 'text-[#DCE8D2]/70 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={e => handleSubmit(e, false)} className="space-y-3.5">
          
          {/* Adventurer Name (ONLY on Sign Up) */}
          {mode === 'signup' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#DCE8D2] flex items-center gap-1.5">
                  <User size={13} className="text-[#F6B8A8]" />
                  Adventurer Name
                </label>
                <span className="text-[10px] text-[#A7B89A]">Optional</span>
              </div>
              <input
                type="text"
                value={adventurerName}
                onChange={e => setAdventurerName(e.target.value)}
                placeholder="e.g. Robin (leave blank for 'Adventurer')"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/25 border border-white/15 text-xs text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#DCE8D2] mb-1 flex items-center gap-1.5">
              <Mail size={13} className="text-[#A7B89A]" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/25 border border-white/15 text-xs text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#A7B89A]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#DCE8D2] mb-1 flex items-center gap-1.5">
              <Lock size={13} className="text-[#F5E6A8]" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/25 border border-white/15 text-xs text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#A7B89A] pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-1.5 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#F6B8A8] to-[#F3A6B7] hover:brightness-105 active:scale-95 text-[#29452B] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {mode === 'signup' ? (
                <>
                  <Sparkles size={14} />
                  <span>{isSubmitting ? 'Creating...' : 'Create Account'}</span>
                </>
              ) : (
                <>
                  <ArrowRight size={14} />
                  <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                </>
              )}
            </button>

            {/* Quick Skip Button for Sign Up */}
            {mode === 'signup' && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={e => handleSubmit(e, true)}
                className="w-full py-1.5 text-center text-[11px] text-[#A7B89A] hover:text-[#FFF5E8] transition-colors cursor-pointer"
              >
                Skip name and join as &ldquo;Adventurer&rdquo; &rarr;
              </button>
            )}

            {/* Divider */}
            <div className="relative py-1 flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute px-2 bg-[#253d26] text-[10px] font-bold text-[#A7B89A]">
                or
              </span>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </form>

        {/* Footer switch */}
        <div className="mt-4 pt-3 text-center border-t border-white/10 text-[11px] text-[#A7B89A]">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className="text-[#F5E6A8] hover:underline font-bold cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Need an account?{' '}
              <button
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className="text-[#F6B8A8] hover:underline font-bold cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
