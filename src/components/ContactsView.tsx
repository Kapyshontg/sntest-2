import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle, Navigation, AlertTriangle, MessageSquare } from 'lucide-react';
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
    <div id="contacts_container" className="space-y-10 animate-fade-in">
      <SEOHead 
        title="Контакты и Обратная Связь — СНТ «Альбатрос»"
        description="Контакты администрации СНТ «Альбатрос», адрес правления, схема проезда и официальная форма обратной связи для изменения персональных данных в реестре."
        keywords="контакты СНТ Альбатрос, телефон председателя СНТ, схема проезда СНТ Альбатрос, реестр садоводов"
      />

      {/* Title block with accent line */}
      <section className="space-y-4 max-w-4xl text-left">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Контакты и обратная связь
        </h1>
        <div className="flex gap-4 items-stretch">
          <div className="w-1.5 bg-[#1b4332] rounded-full shrink-0"></div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light py-0.5">
            Свяжитесь с администрацией товарищества по телефону, электронной почте или оставьте заявку на обновление ваших данных в официальном реестре садоводов СНТ «Альбатрос».
          </p>
        </div>
      </section>

      {/* Grid: Details & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Contacts details column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-3">
              Телефоны и адреса
            </h2>

            <div className="space-y-4 text-xs md:text-sm">
              <div className="flex gap-3">
                <div className="p-2.5 bg-emerald-50/50 rounded-xl text-[#1b4332] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Председатель правления</p>
                  <p className="font-bold text-slate-800">Иванов Игорь Игоревич</p>
                  <a href="tel:+74951234567" className="text-[#1b4332] hover:underline font-semibold">+7 (495) 123-45-67</a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 bg-emerald-50/50 rounded-xl text-[#1b4332] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Электронная почта</p>
                  <a href="mailto:info@snt-albatros.ru" className="font-semibold text-[#1b4332] hover:underline">info@snt-albatros.ru</a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 bg-emerald-50/50 rounded-xl text-[#1b4332] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1 font-light text-slate-600">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Режим работы правления</p>
                  <p className="font-bold text-slate-800 text-xs">Май — Сентябрь:</p>
                  <p>Сб: 11:00 — 15:00, Вс: 11:00 — 13:00</p>
                  <p className="font-bold text-slate-800 text-xs pt-1">Октябрь — Апрель:</p>
                  <p>Каждая первая суббота месяца: 12:00 — 14:00</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2.5 bg-emerald-50/50 rounded-xl text-[#1b4332] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Адрес правления</p>
                  <p className="text-slate-600 font-light text-xs leading-relaxed">РФ, Московская обл., Рузский г.о., дер. Старо, тер. СNT «Альбатрос», дом 1 (Здание Правления на въезде).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social connections block */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-4">
            <h3 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">
              Мы в социальных сетях
            </h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Присоединяйтесь к нашим сообществам для оперативного обсуждения бытовых вопросов и общения с соседями.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a 
                href="https://telegram.org" 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-[#229ED9] hover:bg-[#1c81b2] text-white font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                Telegram Чат
              </a>
              <a 
                href="https://vk.com" 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-[#4c75a3] hover:bg-[#3f628a] text-white font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                Группа ВКонтакте
              </a>
            </div>
          </div>

        </div>

        {/* Right column: Interactive form & Route maps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Support Form */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="border-b border-slate-50 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#1b4332]" />
                Запрос на изменение данных реестра
              </h2>
              <p className="text-xs text-slate-400 font-light mt-1.5">
                В соответствии с ФЗ-217 садоводы обязаны предоставлять актуальные данные (ФИО, телефон, e-mail) для ведения реестра членов СНТ.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">ФИО Садовода</label>
                  <input 
                    type="text"
                    value={fio}
                    onChange={(e) => setFio(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium transition"
                    placeholder="Иванов Иван Иванович"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Номер участка</label>
                  <input 
                    type="text"
                    value={plotNumber}
                    onChange={(e) => setPlotNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium transition"
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Контактный телефон</label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium transition"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Суть обращения / Новые данные</label>
                <textarea 
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium transition"
                  placeholder="Прошу изменить мой контактный email в реестре на test@example.com..."
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                  {error}
                </div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5 font-medium leading-relaxed border border-emerald-100"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Запрос успешно отправлен! Соответствующее уведомление также зарегистрировано в Личном кабинете участка №{plotNumber}.</span>
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1b4332] hover:bg-[#122e22] disabled:bg-[#1b4332]/50 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
              >
                {loading ? 'Отправка...' : <><Send className="w-3.5 h-3.5" /> Отправить обращение в правление</>}
              </button>
            </form>
          </div>

          {/* Interactive route plans */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Navigation className="w-4.5 h-4.5 text-[#1b4332]" />
                Интерактивный маршрут
              </h3>
              
              <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                <button 
                  onClick={() => setActiveRoute('car')}
                  className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${activeRoute === 'car' ? 'bg-white text-[#1b4332] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  На машине
                </button>
                <button 
                  onClick={() => setActiveRoute('train')}
                  className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${activeRoute === 'train' ? 'bg-white text-[#1b4332] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
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
                  className="space-y-2 text-xs text-slate-600 leading-relaxed font-light"
                >
                  <p className="font-bold text-slate-800 text-xs">Маршрут на автомобиле:</p>
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
                  className="space-y-2 text-xs text-slate-600 leading-relaxed font-light"
                >
                  <p className="font-bold text-slate-800 text-xs">Маршрут общественным транспортом:</p>
                  <p>1. От Белорусского вокзала (или МЦД-1) садитесь на электричку до станции <span className="font-semibold text-slate-800">Дорохово</span>.</p>
                  <p>2. На автовокзале ст. Дорохово пересядьте на пригородный автобус <span className="font-semibold text-slate-800">№ 22</span> (направление «Руза») или маршрутку.</p>
                  <p>3. Едьте до остановки <span className="font-semibold text-slate-800">«Деревня Старо»</span> (около 15 минут).</p>
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
