import React from 'react';

export default function CartModal({ isOpen, onClose, cart, onClearCart, darkMode, myTelegramUsername }) {
  if (!isOpen) return null;

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const generateTelegramMessage = () => {
    let text = `📋 *НОВЫЙ ЗАКАЗ МАКЕТОВ FIGMA*\n\n`;
    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.title}* — $${item.price}\n`;
    });
    text += `\n💵 *Итого к оплате:* $${totalPrice}\n\nЗдравствуйте! Хочу приобрести эти макеты.`;
    return encodeURIComponent(text);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Сразу открываем Telegram-чат с текстом заказа
    const cleanUsername = myTelegramUsername.replace('@', '');
    const tgLink = `https://t.me/${cleanUsername}?text=${generateTelegramMessage()}`;
    window.open(tgLink, '_blank');

    // Очищаем корзину и закрываем модалку
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative z-10 w-full max-w-lg border rounded-3xl p-6 sm:p-8 shadow-2xl transition-colors duration-300 ${
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

        <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
          🛒 Корзина ({cart.length})
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Корзина пуста</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6">
            {cart.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                darkMode ? 'bg-purple-950/20 border-purple-800/40' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <img src={item.previewImage} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                    <span className="text-xs font-black text-lime-400">${item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className={`pt-4 border-t ${darkMode ? 'border-purple-900/40' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold">Итого к оплате:</span>
              <span className="text-3xl font-black text-lime-400">${totalPrice}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] active:scale-95"
            >
              Оформить заказ и перейти в Telegram
            </button>
          </div>
        )}
      </div>
    </div>
  );
}