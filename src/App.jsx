import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import LayoutCard from './components/LayoutCard';
import CategoryTabs from './components/CategoryTabs';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import EditProfileModal from './components/EditProfileModal';
import AddLayoutModal from './components/AddLayoutModal';
import EditLayoutModal from './components/EditLayoutModal';
import LayoutDetailsModal from './components/LayoutDetailsModal';
import ResetPasswordModal from './components/ResetPasswordModal';

const MY_TELEGRAM_USERNAME = 'invisibledl';

// Только эти email получают права админа
const ADMIN_EMAILS = ['kotyakotyarovich@gmail.com'];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

const mapSupabaseUser = (sbUser) => {
  if (!sbUser) return null;
  const email = sbUser.email || '';
  const meta = sbUser.user_metadata || {};
  return {
    id: sbUser.id,
    email,
    name: meta.name || email.split('@')[0] || 'Пользователь',
    avatar: meta.avatar || DEFAULT_AVATAR,
    role: ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user'
  };
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  // Текущий пользователь: null = гость
  const [user, setUser] = useState(null);

  // Состояние для макетов и индикатора загрузки
  const [layouts, setLayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  // Модальные окна
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddLayoutOpen, setIsAddLayoutOpen] = useState(false);
  const [isEditLayoutOpen, setIsEditLayoutOpen] = useState(false);
  const [editingLayout, setEditingLayout] = useState(null);

  // Сброс пароля: открывается, когда пользователь пришёл по ссылке из письма
  const [isResetOpen, setIsResetOpen] = useState(
    () => window.location.hash.includes('type=recovery')
  );

  // Подробный просмотр макета
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Корзина и анимации
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [flyingItems, setFlyingItems] = useState([]);

  const cartRef = useRef(null);
  const categories = ['Все', 'Fashion and Style', 'Music', 'Crypto', 'Travel Agency'];

  // 1. Загрузка макетов из Supabase при монтировании компонента
  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('layouts')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Ошибка при загрузке макетов из Supabase:', error.message);
      } else if (data) {
        // Форматируем данные из Supabase под структуру компонентов
        const formattedLayouts = data.map((item) => ({
          id: item.id.toString(),
          title: item.title,
          category: item.category,
          price: Number(item.price),
          previewImage: item.preview_image || item.previewImage,
          tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? JSON.parse(item.tags) : []),
          description: item.description || '',
          author: item.author || { name: 'Администратор', avatar: 'https://i.pravatar.cc/150?img=11' }
        }));
        setLayouts(formattedLayouts);
      }
    } catch (err) {
      console.error('Непредвиденная ошибка:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('figma_vault_user', JSON.stringify(user));
  }, [user]);

  // Подписка на сессию Supabase Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(mapSupabaseUser(data.session?.user));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(mapSupabaseUser(session?.user));
      if (event === 'PASSWORD_RECOVERY') setIsResetOpen(true);
      // после перехода по ссылке из письма убираем токены из адресной строки
      if (event === 'SIGNED_IN' && window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleSaveProfile = async ({ name, avatar }) => {
    const { error } = await supabase.auth.updateUser({ data: { name, avatar } });
    if (error) {
      console.error('Ошибка обновления профиля:', error.message);
    } else {
      setUser((prev) => ({ ...prev, name, avatar }));
    }
  };

  const isAdmin = user && user.role === 'admin';

  // 2. Добавление нового макета в Supabase
  const handleAddLayout = async (newLayout) => {
    const layoutToInsert = {
      title: newLayout.title,
      category: newLayout.category,
      price: newLayout.price,
      preview_image: newLayout.previewImage,
      tags: newLayout.tags,
      description: newLayout.description || '',
      author: newLayout.author
    };

    const { data, error } = await supabase
      .from('layouts')
      .insert([layoutToInsert])
      .select();

    if (error) {
      console.error('Ошибка добавления в Supabase:', error.message);
    } else if (data && data[0]) {
      const insertedItem = {
        ...newLayout,
        id: data[0].id.toString()
      };
      setLayouts([insertedItem, ...layouts]);
    }
  };

  // 3. Обновление макета в Supabase
  const handleSaveLayout = async (updatedLayout) => {
    const { error } = await supabase
      .from('layouts')
      .update({
        title: updatedLayout.title,
        category: updatedLayout.category,
        price: updatedLayout.price,
        preview_image: updatedLayout.previewImage,
        tags: updatedLayout.tags,
        description: updatedLayout.description
      })
      .eq('id', updatedLayout.id);

    if (error) {
      console.error('Ошибка обновления в Supabase:', error.message);
    } else {
      setLayouts(layouts.map((item) => (item.id === updatedLayout.id ? updatedLayout : item)));
    }
  };

  // 4. Удаление макета из Supabase
  const handleDeleteLayout = async (id) => {
    const { error } = await supabase
      .from('layouts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Ошибка удаления из Supabase:', error.message);
    } else {
      setLayouts(layouts.filter((item) => item.id !== id));
    }
  };

  // Анимация улета картинки в корзину
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
    // Гость не может добавлять в корзину: открываем окно входа
    if (!user) {
      setIsDetailsOpen(false);
      setAuthMessage('Войдите или зарегистрируйтесь, чтобы добавить макет в корзину');
      setIsAuthOpen(true);
      return;
    }

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

  const handleOpenEditLayout = (layout) => {
    setEditingLayout(layout);
    setIsEditLayoutOpen(true);
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
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 relative ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
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
        onOpenAuth={() => { setAuthMessage(''); setIsAuthOpen(true); }}
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
        <div className={`text-center py-16 px-4 rounded-3xl border mb-12 relative overflow-hidden transition-colors duration-300 ${darkMode
          ? 'bg-gradient-to-b from-purple-950/40 via-slate-950 to-slate-950 border-purple-900/40 shadow-[0_0_50px_rgba(163,230,53,0.05)]'
          : 'bg-gradient-to-b from-purple-100/60 via-white to-white border-purple-200 shadow-sm'
          }`}>
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 relative z-10">
            Маркетплейс <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-purple-400">Figma макетов</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto relative z-10 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {isAdmin
              ? 'Режим администратора: все изменения синхронизируются с базой данных Supabase.'
              : 'Выбирайте макеты, добавляйте в корзину и оформляйте заказ через Telegram.'}
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

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Загрузка макетов из базы данных...</p>
          </div>
        ) : filteredLayouts.length === 0 ? (
          <div className="text-center py-16">
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Макеты не найдены.</p>
          </div>
        ) : (
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
        )}
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => { setIsAuthOpen(false); setAuthMessage(''); }}
        onAuthSuccess={(sbUser) => setUser(mapSupabaseUser(sbUser))}
        message={authMessage}
        darkMode={darkMode}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
        onLogout={handleLogout}
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
        isAdmin={isAdmin}
      />

      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => {
          setIsResetOpen(false);
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }}
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