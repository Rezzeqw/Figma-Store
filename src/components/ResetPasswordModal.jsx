import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ResetPasswordModal({ isOpen, onClose, darkMode }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const inputClass = `w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-lime-400 ${
    darkMode ? 'bg-slate-800/80 border-purple-800/40 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
  }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message || 'Не удалось изменить пароль');
    } else {
      setDone(true);
      setPassword('');
      setConfirm('');
    }
  };

  const handleClose = () => {
    setDone(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="fixed inset-0" onClick={handleClose} />

      <div className={`relative z-10 w-full max-w-md border rounded-3xl p-6 sm:p-8 shadow-2xl ${
        darkMode ? 'bg-slate-900 border-purple-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          onClick={handleClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
            darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          ✕
        </button>

        <h2 className="text-2xl font-black mb-2 text-center">Новый пароль</h2>

        {done ? (
          <div className="text-center">
            <p className="text-sm text-lime-400 font-semibold mb-6">Пароль успешно изменён!</p>
            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm rounded-xl transition-all"
            >
              Готово
            </button>
          </div>
        ) : (
          <>
            <p className={`text-xs text-center mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Придумайте новый пароль для вашего аккаунта
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">Новый пароль</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">Повторите пароль</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Показать пароль
              </label>

              {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] active:scale-95 disabled:opacity-60"
              >
                {loading ? 'Подождите...' : 'Сохранить пароль'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
