import React, { useState, useEffect } from 'react';

export default function EditProfileModal({ isOpen, onClose, user, onSave, onLogout, darkMode }) {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  useEffect(() => {
    if (isOpen) {
      setName(user?.name || '');
      setAvatar(user?.avatar || '');
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  // Уменьшаем аватарку до 128x128, чтобы не раздувать данные профиля
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const side = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        setAvatar(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, avatar });
    onClose();
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

        <h2 className="text-2xl font-black mb-2 text-center">Редактировать профиль</h2>
        <p className={`text-xs text-center mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Измените имя или загрузите новую аватарку
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center justify-center mb-4">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-lime-400/80 shadow-lg mb-3"
            />
            <label className="cursor-pointer px-4 py-2 bg-purple-950/40 hover:bg-purple-900/60 text-lime-400 font-bold text-xs rounded-xl transition-all border border-lime-400/40">
              Загрузить фото
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5">Имя / Никнейм</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-lime-400 ${darkMode ? 'bg-slate-800/80 border-purple-800/40 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] active:scale-95"
          >
            Сохранить изменения
          </button>
          <button
            type="button"
            onClick={() => { onLogout(); onClose(); }}
            className="w-full py-3 text-red-400 hover:bg-red-500/10 border border-red-500/30 font-bold text-sm rounded-xl transition-all"
          >
            Выйти из аккаунта
          </button>
        </form>
      </div>
    </div>
  );
}