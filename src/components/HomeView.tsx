import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, AlertCircle, TrendingUp, Info, MapPin, Navigation, Map, Shield, Landmark } from 'lucide-react';
import { NewsItem, SntStats } from '../types';
import SEOHead from './SEOHead';

interface HomeViewProps {
  news: NewsItem[];
  stats: SntStats | null;
  onNavigate: (tab: string) => void;
}

export default function HomeView({ news, stats, onNavigate }: HomeViewProps) {
  const [imageRefreshKey, setImageRefreshKey] = useState<number>(0);

  // Trigger a dynamic re-fetch/update of the real-time photo representation
  const handleRefreshImage = () => {
    setImageRefreshKey(prev => prev + 1);
  };

  return (
    <div id="home_container" className="space-y-8 animate-fade-in">
      <SEOHead 
        title="СНТ «Альбатрос» — Официальный сайт садоводческого некоммерческого товарищества"
        description="Официальный сайт СНТ «Альбатрос» Рузского городского округа. Последние новости, тарифы, взносы, контакты администрации и личный кабинет садоводов."
        keywords="СНТ Альбатрос, новости СНТ, Рузский район, Рузский городского округ, взносы, садоводство"
      />

      {/* Hero section with dynamic premium cottage image */}
      <section id="hero_section" className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-950 text-white p-8 md:p-14 shadow-md">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={`https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80&sig=${imageRefreshKey}`}
            alt="СНТ Альбатрос Ландшафт"
            className="w-full h-full object-cover transition-all duration-750"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-5">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#1b4332]/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-300 text-xs font-semibold backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Официальный портал СНТ
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Садоводческое Некоммерческое Товарищество «Альбатрос»
          </h1>
          <p className="text-sm md:text-base text-slate-100/90 max-w-2xl font-light leading-relaxed">
            Профессиональное управление и забота о территории для вашего комфортного отдыха. Современная цифровая экосистема для удобного взаимодействия садоводов и правления.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-4">
            <button 
              id="hero_btn_cabinet"
              onClick={() => onNavigate('cabinet')}
              className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-50 hover:scale-[1.02] transition shadow-md text-xs cursor-pointer"
            >
              Личный кабинет
            </button>
            <button 
              id="hero_btn_payments"
              onClick={() => onNavigate('payments')}
              className="px-6 py-3 rounded-xl bg-[#1b4332] hover:bg-[#153527] border border-transparent hover:scale-[1.02] transition font-bold text-xs text-white cursor-pointer shadow-md"
            >
              Оплата взносов
            </button>
            <button 
              id="hero_btn_refresh_img"
              onClick={handleRefreshImage}
              title="Обновить фоновое изображение"
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition text-[11px] font-bold flex items-center gap-1.5 cursor-pointer text-white"
            >
              🔄 Фото дня
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Action Cards (As seen in design layouts) */}
      <section id="bento_actions" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Payments */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-2 text-left">
            <h3 className="text-base font-bold text-slate-900">Оплата взносов</h3>
            <p className="text-slate-500 text-xs font-light leading-relaxed">
              Быстрая и безопасная оплата членских и целевых взносов онлайн без комиссии.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('payments')}
            className="w-full py-2.5 bg-[#1b4332] hover:bg-[#153527] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm text-center"
          >
            Перейти к оплате
          </button>
        </div>

        {/* Card 2: Documents */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-2 text-left">
            <h3 className="text-base font-bold text-slate-900">Заявления</h3>
            <p className="text-slate-500 text-xs font-light leading-relaxed">
              Подать официальное заявление в правление СНТ в электронном виде или скачать бланки.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('documents')}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition cursor-pointer text-center"
          >
            Оформить заявку
          </button>
        </div>

        {/* Card 3: Finances / Balance */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-2 text-left">
            <h3 className="text-base font-bold text-slate-900">Финансы</h3>
            <p className="text-slate-500 text-xs font-light leading-relaxed">
              Актуальные отчеты о расходах, сметах и текущий баланс лицевого счета вашего участка.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('cabinet')}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition cursor-pointer text-center"
          >
            Смотреть баланс
          </button>
        </div>

      </section>

      {/* Main Contents layout: News vs Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 Cols): News list */}
        <div id="news_column" className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#1b4332] rounded-full"></span>
              Важные новости и объявления
            </h2>
            <button 
              id="btn_all_news"
              onClick={() => onNavigate('cabinet')}
              className="text-xs text-[#1b4332] font-bold hover:underline"
            >
              Все новости →
            </button>
          </div>

          <div className="space-y-4 text-left">
            {news.map((item, idx) => {
              // Accent borders matching the design mockup (red, green, blue cycle)
              const borders = [
                'border-l-red-500 hover:border-red-500/40',
                'border-l-emerald-600 hover:border-emerald-600/40',
                'border-l-blue-500 hover:border-blue-500/40'
              ];
              const borderClass = borders[idx % borders.length];

              // Parse date to badges (e.g. "10 Мая 2024" -> Day: "10", Month: "МАЯ")
              const dateParts = item.date.split(' ');
              const day = dateParts[0] || '10';
              const month = (dateParts[1] || 'МАЯ').toUpperCase();

              return (
                <motion.article 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-5 bg-white rounded-2xl border border-slate-100 border-l-4 ${borderClass} transition hover:shadow-sm flex gap-4 md:gap-5 items-start`}
                >
                  {/* Styled Date Badge on the Left */}
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl shrink-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-black text-slate-800 leading-none">{day}</span>
                    <span className="text-[8px] font-black text-slate-400 mt-1 uppercase tracking-wide leading-none">{month}</span>
                  </div>

                  <div className="space-y-1.5 flex-grow">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1b4332] transition">
                        {item.title}
                      </h3>
                      {item.isImportant && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[9px] font-bold uppercase tracking-wider">
                          Срочно
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 Cols): Widgets */}
        <div id="sidebar_widgets" className="lg:col-span-4 space-y-6 text-left">
          
          {/* SNT in figures - Dark Slate/Navy layout */}
          <div id="widget_figures" className="bg-[#142d53] text-white p-6 rounded-3xl shadow-sm space-y-5 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-5">
              <Landmark className="w-32 h-32 text-white" />
            </div>

            <h3 className="font-bold text-white text-base border-b border-white/10 pb-3">
              СНТ в цифрах
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <span className="text-xl font-black text-emerald-400 font-mono block">150</span>
                <span className="text-[10px] text-slate-300 font-light block leading-tight">Участков в реестре</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl font-black text-emerald-400 font-mono block">45 Га</span>
                <span className="text-[10px] text-slate-300 font-light block leading-tight">Общая площадь</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl font-black text-emerald-400 font-mono block">100%</span>
                <span className="text-[10px] text-slate-300 font-light block leading-tight">Газификация</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl font-black text-emerald-400 font-mono block">24/7</span>
                <span className="text-[10px] text-slate-300 font-light block leading-tight">Охрана и СКУД</span>
              </div>
            </div>
          </div>

          {/* Location & Navigation widget */}
          <div id="widget_location_premium" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-50 pb-3">
              <MapPin className="w-4.5 h-4.5 text-[#1b4332]" />
              Расположение СНТ
            </h3>

            <div className="rounded-xl overflow-hidden relative h-44 border border-slate-150 shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80"
                alt="Статическая карта расположения"
                className="w-full h-full object-cover brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center p-2 text-center">
                <span className="bg-white text-slate-900 text-[10px] px-3 py-1.5 rounded-full font-bold shadow-md flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-[#1b4332] animate-pulse" /> Рузский г.о., д. Петрищево
                </span>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-500 leading-relaxed font-light">
              <p>📍 Московская область, Рузский г.о., д. Петрищево</p>
              <p>🚗 50 км от МКАД по Новорижскому или Минскому шоссе</p>
            </div>

            <button 
              id="btn_route_planning"
              onClick={() => onNavigate('contacts')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Map className="w-3.5 h-3.5 text-slate-400" /> Схема проезда
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
