import React from 'react';

export default function LayoutDetailsModal({ isOpen, onClose, layout, onAddToCart, isInCart, darkMode, isAdmin }) {
  if (!isOpen || !layout) return null;

  const { title, category, price, previewImage, author, tags, description } = layout;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative z-10 w-full max-w-2xl border rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
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

        <div className="relative aspect-video overflow-hidden rounded-2xl mb-6 bg-slate-950 shadow-inner">
          <img src={previewImage} alt={title} className="w-full h-full object-cover" />
          <span className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-xs font-black px-3.5 py-1 rounded-full text-lime-400 border border-lime-400/30">
            {category}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-lime-400/50" />
          <div>
            <span className={`text-xs block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Автор дизайна</span>
            <span className="text-sm font-bold">{author.name}</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black mb-3">{title}</h2>

        <p className={`text-sm leading-relaxed mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          {description || 'Профессиональный и качественный макет Figma с готовыми автолейаутами, адаптивными сетками и современным дизайном. Полностью готов к верстке и интеграции.'}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs font-semibold px-3 py-1 rounded-xl border ${
                darkMode ? 'bg-purple-950/40 border-purple-800/40 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className={`pt-6 border-t flex items-center justify-between ${
          darkMode ? 'border-purple-900/40' : 'border-slate-200'
        }`}>
          <div>
            <span className={`text-xs block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Стоимость макета</span>
            <span className="text-3xl font-black text-lime-400">
              {price === 0 ? 'Бесплатно' : `$${price}`}
            </span>
          </div>

          {!isAdmin && (
            <button
              onClick={() => {
                const rect = document.body.getBoundingClientRect();
                onAddToCart(layout, rect, previewImage);
              }}
              className={`px-6 py-3.5 font-black text-sm rounded-xl transition-all shadow-lg active:scale-95 ${
                isInCart
                  ? 'bg-slate-800 border border-lime-400 text-lime-400 hover:bg-slate-700'
                  : 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.3)]'
              }`}
            >
              {isInCart ? '✓ В корзине' : 'Добавить в корзину'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}