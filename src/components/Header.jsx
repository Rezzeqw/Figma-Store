import React from 'react';

export default function Header({ user, onOpenAuth, onOpenEditProfile, onOpenAddLayout, onSearchChange, cartCount, onOpenCart, darkMode, onToggleTheme, cartRef }) {
  const isAdmin = user && user.role === 'admin';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
      darkMode ? 'bg-slate-950/80 border-purple-900/40 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-[0_0_20px_rgba(163,230,53,0.4)] group-hover:scale-105 transition-transform duration-300">
            <img src="./public/dd8bdbd6-5b3f-4559-9372-fbe7a2b927fd.png" alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-lime-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
            Figma Store
          </span>
        </div>

        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск макетов..."
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full text-sm rounded-xl px-4 py-2.5 pl-10 focus:outline-none transition-all border ${
                darkMode
                  ? 'bg-purple-950/20 border-purple-800/40 text-slate-100 placeholder-slate-500 focus:border-lime-400 focus:ring-1 focus:ring-lime-400'
                  : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600'
              }`}
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={onOpenAddLayout}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/30 active:scale-95 hidden md:block"
            >
              + Добавить макет
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
              darkMode 
                ? 'bg-purple-950/40 border-purple-800/40 text-lime-400 hover:bg-purple-900/50 hover:border-lime-400/50' 
                : 'bg-slate-100 border-slate-300 text-purple-700 hover:bg-purple-50'
            }`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button
            ref={cartRef}
            onClick={onOpenCart}
            className={`relative p-2.5 rounded-xl border transition-all flex items-center gap-2 active:scale-95 ${
              darkMode 
                ? 'bg-purple-950/40 border-purple-800/40 text-white hover:bg-purple-900/50 hover:border-lime-400/50' 
                : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
            }`}
          >
            🛒
            {cartCount > 0 && (
              <span className="bg-lime-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.6)] animate-badge-pop">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div
              onClick={onOpenEditProfile}
              className={`flex items-center gap-3 p-1.5 pr-4 rounded-xl border cursor-pointer transition-all hover:scale-102 active:scale-98 ${
                darkMode 
                  ? 'bg-purple-950/40 border-purple-800/40 hover:border-lime-400/80 hover:shadow-[0_0_15px_rgba(163,230,53,0.15)]' 
                  : 'bg-slate-100 border-slate-300 hover:border-purple-500'
              }`}
            >
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover ring-2 ring-lime-400/60" />
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">{user.name}</span>
                <span className="text-[10px] text-lime-400 font-semibold">{isAdmin ? 'Администратор' : 'Пользователь'}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] active:scale-95"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}