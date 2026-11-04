import React, { useState } from 'react';

export default function AddLayoutModal({ isOpen, onClose, onAddLayout, darkMode }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Landing',
    price: '',
    previewImage: '',
    description: '',
    tags: ''
  });

  if (!isOpen) return null;

  // Функция для загрузки картинки с компьютера
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, previewImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.previewImage) {
      alert('Пожалуйста, выберите картинку с устройства!');
      return;
    }

    const newLayout = {
      title: formData.title,
      category: formData.category,
      price: Number(formData.price) || 0,
      previewImage: formData.previewImage,
      description: formData.description,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : ['Figma'],
      author: { name: 'Администратор', avatar: 'https://i.pravatar.cc/150?img=11' }
    };

    onAddLayout(newLayout);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative z-10 w-full max-w-md border rounded-3xl p-6 sm:p-8 shadow-2xl transition-colors duration-300 max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-slate-900 border-purple-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
            darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          ✕
        </button>

        <h2 className="text-2xl font-black mb-2 text-center">Добавить макет</h2>
        <p className={`text-xs text-center mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Загрузите картинку с устройства и заполните данные
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">Название макета</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Crypto SaaS Dashboard"
              className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-lime-400 ${
                darkMode ? 'bg-slate-800/80 border-purple-800/40 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1.5">Категория</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-lime-400 ${
                  darkMode ? 'bg-slate-800 border-purple-800/40 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Landing">Landing</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Dashboard">Dashboard</option>
                <option value="Games UI">Games UI</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Цена ($)</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="29"
                className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-lime-400 ${
                  darkMode ? 'bg-slate-800/80 border-purple-800/40 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5">Обложка с устройства</label>
            <div className="flex items-center gap-3">
              {formData.previewImage && (
                <img src={formData.previewImage} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-lime-400" />
              )}
              <label className="flex-1 cursor-pointer px-4 py-3 bg-purple-950/40 hover:bg-purple-900/60 text-lime-400 font-bold text-xs rounded-xl text-center transition-all border border-lime-400/40">
                {formData.previewImage ? 'Изменить картинку' : 'Выбрать файл'}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5">Описание</label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Подробное описание макета..."
              className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-lime-400 ${
                darkMode ? 'bg-slate-800/80 border-purple-800/40 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5">Теги (через запятую)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Auto-layout, Crypto, Dark Mode"
              className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-lime-400 ${
                darkMode ? 'bg-slate-800/80 border-purple-800/40 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] active:scale-95"
          >
            Опубликовать макет
          </button>
        </form>
      </div>
    </div>
  );
}