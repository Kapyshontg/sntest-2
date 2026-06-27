import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle, Navigation, Info, AlertTriangle, MessageSquare } from 'lucide-react';
import SEOHead from './SEOHead';

export default function ContactsView() {
  const [fio, setFio] = useState('');
  const [plotNumber, setPlotNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeRoute, setActiveRoute] = useState<'car' | 'train'>('car');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fio || !plotNumber || !phone || !message) {
      setError('Пожалуйста, заполните все поля формы');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fio, plotNumber, phone, message }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке');
      }

      setSuccess(true);
      setFio('');
      setPlotNumber('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при отправке запроса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contacts_container" className="space-y-8">
      <SEOHead 
        title="Контакты и Обратная Связь — СНТ «Альбатрос»"
        description="Контакты администрации СНТ «Альбатрос», адрес правления, схема проезда и официальная форма обратной связи для изменения персональных данных в реестре."
        keywords="контакты СНТ Альбатрос, телефон председателя СНТ, схема проезда СНТ Альбатрос, реестр садоводов"
      />

      {/* Title */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Контакты и обратная связь
        </h1>
        <p className="text-gray-500 text-sm">
          Свяжитесь с администрацией товарищества по телефону, электронной почте или оставьте заявку на обновление ваших данных в официальном реестре садоводов.
        </p>
      </section>

      {/* Grid: Details & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contacts details column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">
              Телефоны и адреса
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Председатель правления</p>
                  <p className="font-semibold text-gray-800">Иванов Игорь Игоревич</p>
                  <a href="tel:+74951234567" className="text-blue-600 hover:underline font-medium">+7 (495) 123-45-67</a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Электронная почта</p>
                  <a href="mailto:info@snt-albatros.ru" className="font-medium text-blue-600 hover:underline">info@snt-albatros.ru</a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Режим работы правления</p>
                  <p className="font-semibold text-gray-800">Май — Сентябрь:</p>
                  <p className="text-gray-600">Сб: 11:00 — 15:00, Вс: 11:00 — 13:00</p>
                  <p className="font-semibold text-gray-800 mt-1">Октябрь — Апрель:</p>
                  <p className="text-gray-600">Каждая первая суббота месяца: 12:00 — 14:00</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Адрес правления</p>
                  <p className="text-gray-700">РФ, Московская обл., Рузский г.о., дер. Старо, тер. СNT «Альбатрос», дом 1 (Здание Правления на въезде).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social connections block */}
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-3">
            <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wider">
              Мы в социальных сетях
            </h3>
            <p className="text-xs text-gray-500">
              Присоединяйтесь к нашим сообществам для оперативного обсуждения бытовых вопросов.
            </p>
            <div className="flex gap-2">
              <a 
                href="https://telegram.org" 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl text-xs transition inline-flex items-center gap-1.5"
              >
                Telegram Чат
              </a>
              <a 
                href="https://vk.com" 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-[#4c75a3] hover:bg-[#3f628a] text-white font-medium rounded-xl text-xs transition inline-flex items-center gap-1.5"
              >
                Группа ВКонтакте
              </a>
            </div>
          </div>

        </div>

        {/* Right column: Interactive form & Route maps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Support Form */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="border-b border-gray-50 pb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Запрос на изменение данных реестра
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                В соответствии с ФЗ-217 садоводы обязаны предоставлять актуальные данные (ФИО, телефон, e-mail) для реестра членов СНТ.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">ФИО Садовода</label>
                  <input 
                    type="text"
                    value={fio}
                    onChange={(e) => setFio(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-3 py-2 text-sm text-gray-900 font-medium"
                    placeholder="Иванов Иван Иванович"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Номер участка</label>
                  <input 
                    type="text"
                    value={plotNumber}
                    onChange={(e) => setPlotNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-3 py-2 text-sm text-gray-900 font-medium"
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Контактный телефон</label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-3 py-2 text-sm text-gray-900 font-medium"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Суть обращения / Новые данные</label>
                <textarea 
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-3 py-2 text-sm text-gray-900 font-medium"
                  placeholder="Прошу изменить мой контактный email в реестре на test@example.com..."
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-blue-50 text-blue-800 text-xs rounded-xl flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                  Запрос отправлен! Обращение зарегистрировано в системе. Соответствующее уведомление добавлено в Личном кабинете участка №{plotNumber}.
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Отправка...' : <><Send className="w-3.5 h-3.5" /> Отправить обращение в правление</>}
              </button>
            </form>
          </div>

          {/* Interactive route plans */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                <Navigation className="w-5 h-5 text-blue-600" />
                Интерактивный маршрут
              </h3>
              
              <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg text-xs">
                <button 
                  onClick={() => setActiveRoute('car')}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${activeRoute === 'car' ? 'bg-white text-slate-950 shadow-sm' : 'text-gray-500 hover:text-gray-855'}`}
                >
                  На машине
                </button>
                <button 
                  onClick={() => setActiveRoute('train')}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${activeRoute === 'train' ? 'bg-white text-slate-950 shadow-sm' : 'text-gray-500 hover:text-gray-855'}`}
                >
                  Общественный
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeRoute === 'car' ? (
                <motion.div 
                  key="car_route"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-2 text-xs text-gray-600 leading-relaxed"
                >
                  <p className="font-bold text-gray-800 text-sm">Маршрут на автомобиле:</p>
                  <p>1. От МКАД двигайтесь прямо по Минскому шоссе (М-1) около 85 км.</p>
                  <p>2. Указатель на г. Руза / ст. Дорохово — поверните направо на А-108.</p>
                  <p>3. Проедьте 12 км мимо деревень Лобково и Грибцово.</p>
                  <p>4. На перекрестке в дер. Старо сверните по указателю «СНТ Альбатрос» налево. Вы прибыли!</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="train_route"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-2 text-xs text-gray-600 leading-relaxed"
                >
                  <p className="font-bold text-gray-800 text-sm">Маршрут общественным транспортом:</p>
                  <p>1. От Белорусского вокзала (или МЦД-1) садитесь на электричку до станции <span className="font-semibold text-gray-850">Дорохово</span>.</p>
                  <p>2. На автовокзале ст. Дорохово пересядьте на пригородный автобус <span className="font-semibold text-blue-700">№ 22</span> (направление «Руза») или маршрутку.</p>
                  <p>3. Едьте до остановки <span className="font-semibold text-gray-850">«Деревня Старо»</span> (около 15 минут).</p>
                  <p>4. Пройдите пешком 600 метров по грунтовой дороге к въездной группе СНТ Альбатрос.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
