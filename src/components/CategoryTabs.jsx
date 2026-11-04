import React from 'react';

export default function CategoryTabs({ categories, selectedCategory, onSelectCategory, darkMode }) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
              isActive
                ? 'bg-lime-400 border-lime-400 text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.4)] scale-105'
                : darkMode
                ? 'bg-purple-950/20 border-purple-900/40 text-slate-400 hover:bg-purple-900/40 hover:text-slate-100 hover:border-purple-700/60'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-purple-50 hover:text-purple-900 hover:border-purple-300'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}