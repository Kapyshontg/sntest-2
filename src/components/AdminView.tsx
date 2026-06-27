import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, Bell, Send, Database, FileCode, CheckCircle, Mail, Phone } from 'lucide-react';
import { Notification, SupportMessage } from '../types';
import SEOHead from './SEOHead';

interface AdminViewProps {
  notifications: Notification[];
  onRefreshNotifications: () => void;
}

export default function AdminView({ notifications, onRefreshNotifications }: AdminViewProps) {
  // Admin stats
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Push notification composer
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'info' | 'warning' | 'success' | 'alert'>('info');
  const [notifTarget, setNotifTarget] = useState('');
  const [composerSuccess, setComposerSuccess] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);

  const fetchAdminDashboard = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('snt_token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const handleComposePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;

    setComposerError(null);
    setComposerSuccess(false);

    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('snt_token')}`
        },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          type: notifType,
          targetPlot: notifTarget || undefined,
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании оповещения');
      }

      setComposerSuccess(true);
      setNotifTitle('');
      setNotifMessage('');
      setNotifTarget('');
      onRefreshNotifications();
      fetchAdminDashboard();
    } catch (err: any) {
      setComposerError(err.message);
    }
  };

  const handleDownloadWpExport = () => {
    fetch('/api/wordpress/export')
      .then(res => res.json())
      .then(data => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "snt_wordpress_export_acf.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      })
      .catch(err => console.error(err));
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-[#1b4332] text-sm font-medium animate-pulse">
        Загрузка статистических данных и панели управления...
      </div>
    );
  }

  const { supportMessages, stats } = metrics || {};

  // Pie chart variables
  const pieData = [
    { name: 'Оплачено взносов', value: stats?.totalCollectedFees || 4125000 },
    { name: 'Задолженность садоводов', value: stats?.totalDebt || 345000 },
  ];
  const COLORS = ['#1b4332', '#ef4444'];

  return (
    <div id="admin_container" className="space-y-10 animate-fade-in text-left">
      <SEOHead 
        title="Панель Управления и Статистики — СНТ «Альбатрос»"
        description="Панель председателя СНТ «Альбатрос». Управление уведомлениями, просмотр переданных показаний счетчиков и статистика сборов."
        keywords="статистика СНТ Альбатрос, админ панель СНТ, управление СНТ Альбатрос"
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#1b4332] uppercase tracking-wider">Административная панель</span>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
            Панель управления и статистики
          </h1>
          <p className="text-slate-500 text-xs font-light max-w-3xl">
            Панель управления СНТ позволяет отслеживать финансовые сборы, потребление энергии, просматривать заявки садоводов и отправлять моментальные пуш-уведомления.
          </p>
        </div>
      </div>

      {/* Stats charts widgets row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart 1: Energy Consumption (AreaChart) (2 cols) */}
        <div id="chart_energy" className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h3 className="font-bold text-slate-950 flex items-center gap-2 text-xs md:text-sm">
              <BarChart3 className="w-5 h-5 text-[#1b4332]" />
              Расход электроэнергии СНТ (по месяцам, кВт·ч)
            </h3>
            <span className="text-[10px] text-[#1b4332] font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Общий ТП: 250 кВт</span>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.energyConsumptionHistory || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1b4332" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1b4332" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} stroke="#94a3b8" fontSize={10} />
                <YAxis tickLine={false} stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }} />
                <Area type="monotone" dataKey="consumption" name="Расход (кВт·ч)" stroke="#1b4332" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConsumption)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Fees Debt vs Collected (PieChart) (1 col) */}
        <div id="chart_collection" className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-950 flex items-center gap-1.5 text-xs md:text-sm border-b border-slate-50 pb-3">
              Финансовые сборы СНТ (2025/2026)
            </h3>

            <div className="h-44 mt-4 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => `${val.toLocaleString()} ₽`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Всего</span>
                <span className="text-sm font-black text-slate-950">4.47 М ₽</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-[11px] pt-4 border-t border-slate-50 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1b4332]"></span>
                <span className="text-slate-500 font-light">Собрано взносов:</span>
              </div>
              <span className="font-bold text-slate-900">{stats?.totalCollectedFees?.toLocaleString()} ₽</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-500 font-light">Общая задолженность:</span>
              </div>
              <span className="font-bold text-rose-600">{stats?.totalDebt?.toLocaleString()} ₽</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Push Notification Composer & Support Message Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Admin Composer for Personal Push Notifications */}
        <div id="composer_push" className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-slate-50 pb-3">
            <h3 className="font-bold text-slate-950 flex items-center gap-2 text-xs md:text-sm">
              <Bell className="w-5 h-5 text-[#1b4332]" />
              Отправка push-уведомления
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 font-light leading-relaxed">
              Уведомление мгновенно отправится в личные кабинеты пользователей. Вы можете сделать рассылку всем или только владельцу конкретного участка.
            </p>
          </div>

          <form onSubmit={handleComposePush} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Заголовок оповещения</label>
              <input 
                type="text"
                required
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium transition"
                placeholder="Внимание: Отключение водоснабжения"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Текст сообщения</label>
              <textarea 
                rows={3}
                required
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-light leading-relaxed transition"
                placeholder="В связи с ремонтными работами на водонапорной башне..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Тип оповещения</label>
                <select 
                  value={notifType}
                  onChange={(e: any) => setNotifType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 outline-none rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium transition"
                >
                  <option value="info">Информационное (Инфо)</option>
                  <option value="warning">Предупреждение</option>
                  <option value="success">Успешное (Зеленый)</option>
                  <option value="alert">Срочное оповещение</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Целевой участок (необязательно)</label>
                <input 
                  type="text"
                  value={notifTarget}
                  onChange={(e) => setNotifTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium transition"
                  placeholder="Оставьте пустым для всех"
                />
              </div>
            </div>

            {composerError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-semibold">
                {composerError}
              </div>
            )}

            {composerSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5 font-bold border border-emerald-100 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Оповещение успешно отправлено! Добавлено в реестр рассылок СНТ.
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3 bg-[#1b4332] hover:bg-[#122e22] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Опубликовать push-уведомление
            </button>
          </form>
        </div>

        {/* Support messages log submitted via contacts page */}
        <div id="messages_log" className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-950 flex items-center gap-2 text-xs md:text-sm border-b border-slate-50 pb-3">
              <Mail className="w-5 h-5 text-[#1b4332]" />
              Входящие обращения садоводов ({supportMessages?.length || 0})
            </h3>

            <div className="mt-4 space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {!supportMessages || supportMessages.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-10 text-center font-light">Новых входящих писем и обращений нет</p>
              ) : (
                supportMessages.map((msg: SupportMessage) => (
                  <div key={msg.id} className="p-3.5 border border-slate-100 rounded-2xl bg-slate-50/50 text-xs space-y-2 animate-fade-in">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-bold text-slate-800">{msg.fio}</p>
                        <p className="text-[10px] text-slate-400 font-light">Участок: <span className="font-bold text-slate-600">№{msg.plotNumber}</span></p>
                      </div>
                      <span className="text-[9px] text-slate-400 font-light">{msg.createdAt}</span>
                    </div>

                    <p className="text-slate-600 font-light leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                      "{msg.message}"
                    </p>

                    <div className="flex gap-2 text-[10px] text-[#1b4332] font-bold">
                      <a href={`tel:${msg.phone}`} className="flex items-center gap-1 hover:underline">
                        <Phone className="w-3 h-3 text-[#1b4332]" /> Позвонить: {msg.phone}
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* WordPress & SEO Toolkit Section */}
      <section id="wordpress_toolkit" className="bg-[#1b4332] text-white rounded-3xl p-6 md:p-8 shadow-md grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#122e22]/60 border border-[#2d5f47] px-3 py-1 rounded-full text-emerald-100 text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-400" /> WordPress Integration Kit
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white leading-tight">
            SEO Оптимизация и интеграция с WordPress CMS
          </h2>
          <p className="text-xs text-emerald-100/80 leading-relaxed font-light">
            Данный прототип полностью готов к переносу на CMS WordPress! Весь контент (новости, статистика, реквизиты) структурирован по методологии Custom Post Types и готов к импорту через плагин Advanced Custom Fields (ACF). Код спроектирован с учетом SEO-оптимизации, семантической разметки и динамических мета-тегов.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            id="btn_download_wp_json"
            onClick={handleDownloadWpExport}
            className="w-full py-3 bg-white text-slate-950 hover:bg-slate-50 transition font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <FileCode className="w-4 h-4 text-[#1b4332] animate-bounce" /> Экспорт структуры ACF JSON
          </button>
          
          <div className="text-[10px] text-emerald-100/60 text-center font-light leading-relaxed">
            Будет выгружен JSON-конфиг WordPress ACF, готовый для импорта в WP-Admin.
          </div>
        </div>
      </section>

    </div>
  );
}
