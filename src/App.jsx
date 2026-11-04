import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import LayoutCard from './components/LayoutCard';
import CategoryTabs from './components/CategoryTabs';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import EditProfileModal from './components/EditProfileModal';
import AddLayoutModal from './components/AddLayoutModal';
import EditLayoutModal from './components/EditLayoutModal';
import LayoutDetailsModal from './components/LayoutDetailsModal';

const MY_TELEGRAM_USERNAME = '@invisibledl';

const INITIAL_LAYOUTS = [
  {
    id: '1',
    title: 'Dark Fantasy RPG UI Kit & Dashboard',
    category: 'Games UI',
    price: 29,
    previewImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    tags: ['Auto-layout', 'Design System', 'Dark Mode'],
    description: 'Масштабный UI Kit в темном стиле для RPG игр и гейминг-порталов. Содержит компоненты дашбордов, инвентаря и профилей.',
    author: { name: 'Alex Design', avatar: 'https://i.pravatar.cc/150?img=11' }
  },
  {
    id: '2',
    title: 'Wavy E-Commerce Storefront 2026',
    category: 'E-Commerce',
    price: 19,
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tags: ['Shopify', 'React Ready', 'Components'],
    description: 'Современный интернет-магазин с адаптивным дизайном под мобильные устройства и десктоп. Готовые страницы каталога и корзины.',
    author: { name: 'DevStudio', avatar: 'https://i.pravatar.cc/150?img=33' }
  },
  {
    id: '3',
    title: 'SaaS Analytics & AI Control Panel',
    category: 'Dashboard',
    price: 35,
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['Figma Variables', 'Charts', 'SaaS'],
    description: 'Панель управления для SaaS продуктов с графиками, таблицами и темной темой на базе переменных Figma.',
    author: { name: 'Elena UI', avatar: 'https://i.pravatar.cc/150?img=47' }
  }
];

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('figma_vault_user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Максим',
      email: 'maxim@example.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
  });

  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem('figma_vault_layouts');
    return savedLayouts ? JSON.parse(savedLayouts) : INITIAL_LAYOUTS;
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddLayoutOpen, setIsAddLayoutOpen] = useState(false);
  
  const [isEditLayoutOpen, setIsEditLayoutOpen] = useState(false);
  const [editingLayout, setEditingLayout] = useState(null);

  // Состояние для модального окна подробного просмотра макета
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [flyingItems, setFlyingItems] = useState([]);

  const cartRef = useRef(null);
  const categories = ['Все', 'E-Commerce', 'Dashboard', 'Landing', 'Games UI'];

  useEffect(() => {
    localStorage.setItem('figma_vault_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('figma_vault_layouts', JSON.stringify(layouts));
  }, [layouts]);

  const isAdmin = user && user.role === 'admin';

  const triggerFlyAnimation = (sourceRect, imageSrc) => {
    if (!cartRef.current) return;
    const cartRect = cartRef.current.getBoundingClientRect();

    const flyingId = Date.now();
    const targetX = cartRect.left - sourceRect.left;
    const targetY = cartRect.top - sourceRect.top;

    const newItem = {
      id: flyingId,
      imageSrc,
      left: sourceRect.left,
      top: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
      targetX,
      targetY
    };

    setFlyingItems((prev) => [...prev, newItem]);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== flyingId));
    }, 750);
  };

  const handleAddToCart = (layout, btnRect, imageSrc) => {
    if (cart.some((item) => item.id === layout.id)) {
      setCart(cart.filter((item) => item.id !== layout.id));
    } else {
      if (btnRect) triggerFlyAnimation(btnRect, imageSrc);
      setCart([...cart, layout]);
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleAddLayout = (newLayout) => {
    setLayouts([newLayout, ...layouts]);
  };

  const handleDeleteLayout = (id) => {
    setLayouts(layouts.filter((item) => item.id !== id));
  };

  const handleOpenEditLayout = (layout) => {
    setEditingLayout(layout);
    setIsEditLayoutOpen(true);
  };

  const handleSaveLayout = (updatedLayout) => {
    setLayouts(layouts.map((item) => (item.id === updatedLayout.id ? updatedLayout : item)));
  };

  const handleCardClick = (layout) => {
    setSelectedLayout(layout);
    setIsDetailsOpen(true);
  };

  const filteredLayouts = layouts.filter((item) => {
    const matchesCategory = selectedCategory === 'Все' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 relative ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {flyingItems.map((item) => (
        <img
          key={item.id}
          src={item.imageSrc}
          alt="Flying"
          className="animate-fly-cart rounded-2xl shadow-2xl border-2 border-lime-400 object-cover"
          style={{
            left: `${item.left}px`,
            top: `${item.top}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
            '--target-x': `${item.targetX}px`,
            '--target-y': `${item.targetY}px`
          }}
        />
      ))}

      <Header
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenAddLayout={() => setIsAddLayoutOpen(true)}
        onSearchChange={setSearchQuery}
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        cartRef={cartRef}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className={`text-center py-16 px-4 rounded-3xl border mb-12 relative overflow-hidden transition-colors duration-300 ${
          darkMode
            ? 'bg-gradient-to-b from-purple-950/40 via-slate-950 to-slate-950 border-purple-900/40 shadow-[0_0_50px_rgba(163,230,53,0.05)]'
            : 'bg-gradient-to-b from-purple-100/60 via-white to-white border-purple-200 shadow-sm'
        }`}>
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 relative z-10">
            Маркетплейс <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-purple-400">Figma макетов</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto relative z-10 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Нажмите на любую карточку, чтобы посмотреть подробное описание макета.
          </p>

          {isAdmin && (
            <button
              onClick={() => setIsAddLayoutOpen(true)}
              className="mt-6 px-6 py-3 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm rounded-xl shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all md:hidden inline-block"
            >
              + Добавить макет
            </button>
          )}
        </div>

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          darkMode={darkMode}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLayouts.map((layout) => (
            <LayoutCard
              key={layout.id}
              layout={layout}
              onAddToCart={handleAddToCart}
              onDeleteLayout={handleDeleteLayout}
              onEditLayout={handleOpenEditLayout}
              onCardClick={handleCardClick}
              isInCart={cart.some((item) => item.id === layout.id)}
              darkMode={darkMode}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
        darkMode={darkMode}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={(updatedUser) => setUser(updatedUser)}
        darkMode={darkMode}
      />

      <AddLayoutModal
        isOpen={isAddLayoutOpen}
        onClose={() => setIsAddLayoutOpen(false)}
        onAddLayout={handleAddLayout}
        darkMode={darkMode}
      />

      <EditLayoutModal
        isOpen={isEditLayoutOpen}
        onClose={() => setIsEditLayoutOpen(false)}
        layout={editingLayout}
        onSaveLayout={handleSaveLayout}
        darkMode={darkMode}
      />

      <LayoutDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        layout={selectedLayout}
        onAddToCart={handleAddToCart}
        isInCart={selectedLayout ? cart.some((item) => item.id === selectedLayout.id) : false}
        darkMode={darkMode}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        darkMode={darkMode}
        myTelegramUsername={MY_TELEGRAM_USERNAME}
      />
    </div>
  );
}