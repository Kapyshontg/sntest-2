import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Flame, Zap, Construction, Activity, CheckCircle2, AlertTriangle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import SEOHead from './SEOHead';

interface InfraItem {
  id: string;
  name: string;
  status: 'operational' | 'maintenance' | 'planned';
  statusText: string;
  icon: React.ElementType;
  progress?: number;
  details: string;
  updatedAt: string;
}

export default function InfrastructureView() {
  const [liveTelemetry, setLiveTelemetry] = useState<boolean>(true);
  const [telemetryLoad, setTelemetryLoad] = useState<number>(42); // simulated electricity load kw
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const infraItems: InfraItem[] = [
    {
      id: 'substation',
      name: 'Трансформаторная подстанция (ТП-150)',
      status: 'operational',
      statusText: 'Работает штатно',
      icon: Zap,
      details: 'Выделенная мощность 250 кВт. В 2025 году произведена замена автоматических выключателей и протяжка контактов. Стабильное напряжение по всем трем фазам.',
      updatedAt: 'Сегодня в 08:30',
    },
    {
      id: 'gas',
      name: 'Социальная газификация',
      status: 'planned',
      statusText: 'Строительство сетей',
      progress: 75,
      icon: Flame,
      details: 'Работы по прокладке газопровода низкого давления завершены на 75%. Ведется подготовка документов для врезки в распределительную магистраль.',
      updatedAt: 'Вчера в 17:15',
    },
    {
      id: 'security',
      name: 'Система видеонаблюдения и СКУД',
      status: 'operational',
      statusText: 'Активно',
      progress: 100,
      icon: ShieldCheck,
      details: 'Установлено 12 камер высокого разрешения по периметру и на въездах. Автоматический шлагбаум работает по распознаванию номеров и звонку с мобильного телефона.',
      updatedAt: 'Сегодня, 11:20',
    },
    {
      id: 'roads',
      name: 'Ремонт дорожного покрытия',
      status: 'maintenance',
      statusText: 'Плановые работы',
      icon: Construction,
      details: 'Проводится регулярный ямочный ремонт и отсыпка асфальтовой крошкой внутренних проездов СНТ. В повестке дня собрания — асфальтирование центральной аллеи.',
      updatedAt: '12 мая 2025',
    },
  ];

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTelemetryLoad(Math.floor(30 + Math.random() * 35));
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div id="infrastructure_container" className="space-y-8">
      <SEOHead 
        title="Инфраструктура Товарищества — СНТ «Альбатрос»"
        description="Техническое состояние инфраструктуры СНТ «Альбатрос». Телеметрия электроснабжения, статус газификации, автоматизированные шлагбаумы СКУД и ремонт дорог."
        keywords="инфраструктура СНТ Альбатрос, шлагбаум СНТ, газификация СНТ, электросети товарищества"
      />

      {/* Header section */}
      <section className="space-y-4 max-w-4xl">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Инфраструктура товарищества
        </h1>
        <div className="flex gap-4 items-stretch">
          <div className="w-1.5 bg-[#1b4332] rounded-full shrink-0"></div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light py-0.5">
            Мониторинг текущего состояния инженерных систем, графиков профилактического обслуживания и планов по модернизации территории общего пользования СНТ «Альбатрос».
          </p>
        </div>
      </section>

      {/* Live Telemetry Display */}
      <section className="bg-slate-50 border border-slate-150 p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2.5 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#1b4332]" />
              Живая телеметрия ТП-150
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLiveTelemetry(!liveTelemetry)}
              className="text-xs font-semibold text-slate-600 hover:text-[#1b4332] flex items-center gap-1.5 transition cursor-pointer"
            >
              {liveTelemetry ? <><EyeOff className="w-4 h-4 text-slate-400" /> Скрыть датчики</> : <><Eye className="w-4 h-4 text-slate-400" /> Показать датчики</>}
            </button>
            <button 
              onClick={handleRefreshTelemetry}
              disabled={isRefreshing}
              className={`p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 transition cursor-pointer ${isRefreshing ? 'animate-spin text-[#1b4332]' : ''}`}
              title="Обновить телеметрию"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {liveTelemetry ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-inner-sm space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Текущая нагрузка электросети</p>
              <p className="text-3xl font-black font-mono text-slate-850">
                {telemetryLoad} <span className="text-sm font-medium text-slate-400">кВт</span>
              </p>
              <p className="text-[10px] text-slate-500">Допустимый максимум нагрузки: 180 кВт в пиковые часы.</p>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-inner-sm space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Напряжение в фазах</p>
              <p className="text-2xl font-black font-mono text-slate-850">
                228В / 231В / 229В
              </p>
              <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Отклонения в пределах нормы (±5%).
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-inner-sm space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Статус въездного шлагбаума</p>
              <p className="text-xl font-bold text-slate-850 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Онлайн (Открыт)</span>
              </p>
              <p className="text-[10px] text-slate-500">GSM-модуль СКУД принимает вызовы. Распознавание номеров активно.</p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 bg-white/70 border border-dashed border-slate-200 rounded-xl">
            Телеметрический дашборд скрыт. Вы можете включить его отображение с помощью переключателя выше.
          </div>
        )}
      </section>

      {/* Infrastructure Systems Grid */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900">
          Инженерно-бытовые системы товарищества
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infraItems.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1b4332]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-850 text-sm leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Обновлено: {item.updatedAt}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'operational' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                      item.status === 'maintenance' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                      'bg-blue-50 text-blue-800 border border-blue-100'
                    }`}>
                      {item.statusText}
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed font-light">
                    {item.details}
                  </p>

                  {item.progress !== undefined && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-400">Прогресс работ</span>
                        <span className="text-[#1b4332]">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-600 to-[#1b4332] transition-all duration-700"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Info Notice about garbage disposal */}
      <section className="bg-[#1b4332]/5 border border-[#1b4332]/10 p-5 rounded-2xl flex flex-col sm:flex-row items-start gap-4">
        <div className="p-2.5 bg-white border border-[#1b4332]/10 rounded-xl text-[#1b4332] shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-light">
          <h4 className="font-bold text-slate-900 text-sm">Правила вывоза отходов и содержание контейнерной площадки</h4>
          <p>
            Вывоз ТКО осуществляется по вторникам и субботам. Категорически запрещено складировать строительный мусор, порубочные остатки деревьев и крупногабаритную бытовую технику на контейнерной площадке. Для вывоза крупного мусора заказывайте индивидуальный контейнер через правление.
          </p>
        </div>
      </section>
    </div>
  );
}
