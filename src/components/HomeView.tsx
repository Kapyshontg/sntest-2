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
    <div id="home_container" className="space-y-8">
      <SEOHead 
        title="СНТ «Альбатрос» — Официальный сайт садоводческого некоммерческого товарищества"
        description="Официальный сайт СНТ «Альбатрос» Рузского городского округа. Последние новости, тарифы, взносы, контакты администрации и личный кабинет садоводов."
        keywords="СНТ Альбатрос, новости СНТ, Рузский район, Рузский городской округ, взносы, садоводство"
      />

      {/* Hero section with dynamic image and live stats overview */}
      <section id="hero_section" className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-950 text-white p-6 md:p-12 shadow-xl">
        <div className="absolute inset-0 opacity-25">
          <img 
            src={`https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80&sig=${imageRefreshKey}`}
            alt="СНТ Альбатрос Ландшафт"
            className="w-full h-full object-cover transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3.5 py-1 rounded-full text-blue-300 text-xs font-semibold backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Официальный сайт товарищества
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            СНТ «Альбатрос»
          </h1>
          <p className="text-base md:text-lg text-slate-100/90 max-w-2xl font-light leading-relaxed">
            Добро пожаловать на цифровой портал СНТ «Альбатрос». Здесь вы можете узнать свежие новости, ознакомиться с официальными документами, сдать показания приборов учёта и оплатить членские взносы онлайн.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <button 
              id="hero_btn_cabinet"
              onClick={() => onNavigate('cabinet')}
              className="px-6 py-2.5 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-50 transition shadow-lg text-sm cursor-pointer"
            >
              Личный кабинет
            </button>
            <button 
              id="hero_btn_payments"
              onClick={() => onNavigate('payments')}
              className="px-6 py-2.5 rounded-xl bg-blue-800/40 border border-blue-500/40 hover:bg-blue-800/60 transition font-semibold text-sm cursor-pointer"
            >
              Оплата взносов
            </button>
            <button 
              id="hero_btn_refresh_img"
              onClick={handleRefreshImage}
              title="Обновить фоновое изображение"
              className="px-3.5 py-2.5 rounded-xl bg-slate-950/45 border border-slate-500/30 hover:bg-slate-900/60 transition text-xs flex items-center gap-1 cursor-pointer"
            >
              🔄 Фото дня
            </button>
          </div>
        </div>
      </section>

      {/* SNT Statistics Overview Bento-Grid */}
      <section id="stats_overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="stat_plots" className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start text-blue-600">
            <Landmark className="w-6 h-6" />
            <span className="text-xs font-medium text-gray-400">Участков</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{stats ? stats.totalPlots : "350"}</h3>
            <p className="text-xs text-gray-500 mt-1">Всего в реестре</p>
          </div>
        </div>

        <div id="stat_members" className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start text-blue-600">
            <Shield className="w-6 h-6" />
            <span className="text-xs font-medium text-gray-400">Членов СНТ</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{stats ? stats.totalMembers : "280"}</h3>
            <p className="text-xs text-gray-500 mt-1">Официально зарегистрировано</p>
          </div>
        </div>

        <div id="stat_tariffs" className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start text-amber-600">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium text-gray-400">Тариф взноса</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{stats ? `${stats.feePerSotka} ₽` : "1 500 ₽"}</h3>
            <p className="text-xs text-gray-500 mt-1">За 1 сотку в год</p>
          </div>
        </div>

        <div id="stat_power" className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex justify-between items-start text-purple-600">
            <Info className="w-6 h-6" />
            <span className="text-xs font-medium text-gray-400">Мощность ТП</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{stats ? stats.tpPower : "250 кВт"}</h3>
            <p className="text-xs text-gray-500 mt-1">Энергосистема товарищества</p>
          </div>
        </div>
      </section>

      {/* Main Content Layout - News & Interactive Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* News Column (Left) */}
        <div id="news_column" className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Новости и важные оповещения
            </h2>
            <button 
              id="btn_all_news"
              onClick={() => onNavigate('cabinet')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Архив новостей →
            </button>
          </div>

          <div className="space-y-4">
            {news.map((item) => (
              <motion.article 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border transition hover:border-blue-300 hover:shadow-sm ${
                  item.isImportant 
                    ? 'bg-red-50/50 border-red-200' 
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">{item.date}</span>
                  </div>
                  {item.isImportant && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3" /> Важно
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-1">
                  {item.content}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets Column (Right) */}
        <div id="sidebar_widgets" className="space-y-6">
          
          {/* SNT Information Block */}
          <div id="widget_contacts" className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
              <Landmark className="w-5 h-5 text-blue-600" />
              Правление СНТ
            </h3>
            
            <div className="space-y-3.5 text-sm">
              <div>
                <p className="text-xs text-gray-400">Председатель правления:</p>
                <p className="font-semibold text-gray-800">Иванов Игорь Игоревич</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Телефон правления:</p>
                <a href="tel:+74951234567" className="font-semibold text-blue-600 hover:underline">
                  +7 (495) 123-45-67
                </a>
              </div>

              <div>
                <p className="text-xs text-gray-400">Приёмные часы:</p>
                <p className="font-medium text-gray-700">Каждая суббота с 11:00 до 15:00</p>
              </div>
            </div>

            <button 
              id="btn_view_contacts"
              onClick={() => onNavigate('contacts')}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl text-xs transition cursor-pointer"
            >
              Посмотреть полные контакты
            </button>
          </div>

          {/* Location & Navigation Block */}
          <div id="widget_location" className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              Как нас найти
            </h3>

            <div className="rounded-xl overflow-hidden relative h-40 border border-gray-100 shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80"
                alt="Статическая карта расположения"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center p-2 text-center">
                <span className="bg-white/95 text-slate-950 text-xs px-3 py-1.5 rounded-full font-bold shadow flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-600" /> Рузский р-н, дер. Старо
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <p className="flex gap-2">
                <span className="font-bold text-gray-800">На авто:</span> 85-й км Минского шоссе, далее 12 км в сторону г. Руза.
              </p>
              <p className="flex gap-2">
                <span className="font-bold text-gray-800">Электричкой:</span> Белорусское направление до ст. «Дорохово», далее автобус №22.
              </p>
            </div>

            <button 
              id="btn_route_planning"
              onClick={() => onNavigate('contacts')}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Map className="w-3.5 h-3.5 text-gray-500" /> Интерактивный маршрут
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
