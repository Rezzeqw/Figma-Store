import React from 'react';

export default function LayoutCard({ layout, onAddToCart, onDeleteLayout, onEditLayout, onCardClick, isInCart, darkMode, isAdmin }) {
  const { title, category, price, previewImage, author, tags } = layout;

  const handleBtnClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    onAddToCart(layout, rect, previewImage);
  };

  return (
    <div 
      onClick={() => onCardClick(layout)}
      className={`group relative border rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col cursor-pointer ${
        darkMode
          ? 'bg-slate-900/60 border-purple-900/40 hover:border-lime-400/60 hover:shadow-[0_10px_30px_rgba(163,230,53,0.15)]'
          : 'bg-white border-slate-200 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10'
      }`}
    >
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img
          src={previewImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
        <span className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-xs font-black px-3.5 py-1 rounded-full text-lime-400 border border-lime-400/30 shadow-lg">
          {category}
        </span>

        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEditLayout(layout)}
              className="bg-purple-600/90 hover:bg-purple-600 text-white p-2 rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95"
              title="Редактировать макет"
            >
              ✏️
            </button>
            <button
              onClick={() => onDeleteLayout(layout.id)}
              className="bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95"
              title="Удалить макет"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={author.avatar} alt={author.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-lime-400/50" />
            <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {author.name}
            </span>
          </div>

          <h3 className={`text-lg font-bold group-hover:text-lime-400 transition-colors duration-300 line-clamp-1 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {title}
          </h3>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-purple-950/40 border-purple-800/40 text-purple-300 group-hover:border-lime-400/30' 
                    : 'bg-purple-50 border-purple-200 text-purple-700'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className={`mt-6 pt-4 border-t flex items-center justify-between gap-3 ${
          darkMode ? 'border-purple-900/40' : 'border-slate-100'
        }`}>
          <div>
            <span className={`text-xs font-semibold block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Цена</span>
            <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {price === 0 ? 'Бесплатно' : `$${price}`}
            </span>
          </div>

          {!isAdmin && (
            <button
              onClick={handleBtnClick}
              className={`px-4 py-2.5 font-black text-sm rounded-xl transition-all duration-300 shadow-md active:scale-95 flex items-center gap-2 ${
                isInCart
                  ? 'bg-slate-800 border border-lime-400 text-lime-400 hover:bg-slate-700'
                  : 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-[0_0_15px_rgba(163,230,53,0.3)]'
              }`}
            >
              {isInCart ? '✓ В корзине' : 'В корзину'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}