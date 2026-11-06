import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, darkMode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        onAuthSuccess(data.user);
        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { name: formData.name } }
        });
        if (error) throw error;
        if (data.session) {
          onAuthSuccess(data.user);
          onClose();
        } else {
          setInfo('Мы отправили письмо для подтверждения. Подтвердите email и войдите.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError(err.message || 'Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative z-10 w-full max-w-md border rounded-3xl p-6 sm:p-8 shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-purple-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          ✕
        </button>

        <div className={`flex p-1 rounded-2xl mb-6 border ${darkMode ? 'bg-purple-950/30 border-purple-800/40' : 'bg-slate-100 border-slate-200'
          }`}>
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-black rounded-xl transition-all ${isLogin ? 'bg-lime-400 text-slate-950 shadow-md' : 'text-slate-400'
              }`}
          >
            Вход
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-black rounded-xl transition-all ${!isLogin ? 'bg-lime-400 text-slate-950 shadow-md' : 'text-slate-400'
              }`}
          >
            Регистрация
          </button>
        </div>

        <h2 className="text-2xl font-black mb-2 text-center">
          {isLogin ? 'С возвращением!' : 'Создать аккаунт'}
        </h2>
        <p className={`text-xs text-center mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {isLogin ? 'Войдите в свой аккаунт' : 'Регистрация нового пользователя'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold mb-1.5">Имя</label>
              <input
                type="text"
                name="name"
                required
                minLength={6}
                value={formData.name}
                onChange={handleChange}
                placeholder="Максим"
                className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-lime-400 ${darkMode ? 'bg-slate-800/80 border-purple-800/40 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-lime-400 ${darkMode ? 'bg-slate-800/80 border-purple-800/40 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full text-sm rounded-xl px-4 py-3 pr-12 border focus:outline-none focus:border-lime-400 ${darkMode ? 'bg-slate-800/80 border-purple-800/40 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-lime-400 focus:outline-none p-1"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>



          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
          {info && <p className="text-xs text-lime-400 font-semibold">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] active:scale-95 disabled:opacity-60"
          >
            {loading ? 'Подождите...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
}