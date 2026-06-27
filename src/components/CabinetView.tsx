import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User as UserIcon, AlertTriangle, Key, LogOut, Check, CreditCard, Activity, CheckSquare, Bell } from 'lucide-react';
import { User, Notification, VotingSession } from '../types';
import SEOHead from './SEOHead';

interface CabinetViewProps {
  user: User | null;
  onLogin: (token: string, user: User) => void;
  onLogout: () => void;
  notifications: Notification[];
  onRefreshNotifications: () => void;
}

export default function CabinetView({ user, onLogin, onLogout, notifications, onRefreshNotifications }: CabinetViewProps) {
  // Auth state
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fio, setFio] = useState('');
  const [plotNumber, setPlotNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [plotArea, setPlotArea] = useState('800');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Cabinet actions state
  const [newReading, setNewReading] = useState('');
  const [readingLoading, setReadingLoading] = useState(false);
  const [readingError, setReadingError] = useState<string | null>(null);
  const [readingSuccess, setReadingSuccess] = useState(false);

  const [payAmount, setPayAmount] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // Voting state
  const [votings, setVotings] = useState<VotingSession[]>([]);
  const [userVotedIds, setUserVotedIds] = useState<Record<string, string>>({});

  // Fetch Votings & User Votes
  const fetchVotingsData = async () => {
    try {
      const response = await fetch('/api/voting');
      const data = await response.json();
      setVotings(data);

      if (localStorage.getItem('snt_token')) {
        const votesResponse = await fetch('/api/cabinet/my-votes', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('snt_token')}` }
        });
        if (votesResponse.ok) {
          const votesData = await votesResponse.json();
          setUserVotedIds(votesData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVotingsData();
  }, [user]);

  // Auth Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const url = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
    const body = isRegisterMode 
      ? { username, password, fio, plotNumber, phone, email, plotArea: Number(plotArea) }
      : { username, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка аутентификации');
      }

      onLogin(data.token, data.user);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Submit Meter Reading
  const handleMeterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReading) return;

    setReadingLoading(true);
    setReadingError(null);
    setReadingSuccess(false);

    try {
      const token = localStorage.getItem('snt_token');
      const response = await fetch('/api/cabinet/meter-readings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value: Number(newReading) }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отправки показаний');
      }

      // Update local user object state through onLogin
      onLogin(token || '', data.user);
      setReadingSuccess(true);
      setNewReading('');
      onRefreshNotifications();
    } catch (err: any) {
      setReadingError(err.message);
    } finally {
      setReadingLoading(false);
    }
  };

  // Pay Emulator
  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount) return;

    setPayLoading(true);
    setPaySuccess(false);

    try {
      const token = localStorage.getItem('snt_token');
      const response = await fetch('/api/cabinet/pay', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(payAmount) }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка платежа');
      }

      onLogin(token || '', data.user);
      setPaySuccess(true);
      setPayAmount('');
      onRefreshNotifications();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPayLoading(false);
    }
  };

  // Cast electronic vote
  const handleCastVote = async (sessionId: string, optionId: string) => {
    try {
      const token = localStorage.getItem('snt_token');
      const response = await fetch('/api/cabinet/vote', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ votingSessionId: sessionId, optionId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка голосования');
      }

      // Refresh voting layouts
      fetchVotingsData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div id="cabinet_container" className="space-y-10 animate-fade-in">
      <SEOHead 
        title={user ? `Личный кабинет уч. №${user.plotNumber} — СНТ «Альбатрос»` : "Вход в Личный Кабинет — СНТ «Альбатрос»"}
        description="Личный кабинет садовода СНТ «Альбатрос». Передача показаний счетчиков электричества онлайн, контроль баланса лицевого счета, электронные голосования."
        keywords="личный кабинет СНТ Альбатрос, показания счетчика электричества, проголосовать онлайн СНТ"
      />

      <AnimatePresence mode="wait">
        {!user ? (
          /* ======================================================== */
          /* AUTHENTICATION PORTAL (Login & Register)                 */
          /* ======================================================== */
          <motion.div 
            key="auth_portal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md mx-auto bg-white border border-slate-100 p-8 rounded-3xl shadow-xl space-y-6 text-left"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1b4332] flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {isRegisterMode ? 'Регистрация садовода' : 'Вход в личный кабинет'}
              </h1>
              <p className="text-xs text-slate-400 font-light">
                {isRegisterMode ? 'Создайте учетную запись участника СНТ' : 'Введите ваши учетные данные для авторизации'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Имя пользователя (логин)</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                    <input 
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium transition"
                      placeholder="Например: ivan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Пароль</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {isRegisterMode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3.5 pt-3 border-t border-slate-100"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">ФИО Садовода</label>
                      <input 
                        type="text"
                        required={isRegisterMode}
                        value={fio}
                        onChange={(e) => setFio(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium transition"
                        placeholder="Петров Петр Петрович"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Номер участка</label>
                        <input 
                          type="text"
                          required={isRegisterMode}
                          value={plotNumber}
                          onChange={(e) => setPlotNumber(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium transition"
                          placeholder="123"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Площадь (кв.м)</label>
                        <input 
                          type="number"
                          required={isRegisterMode}
                          value={plotArea}
                          onChange={(e) => setPlotArea(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium transition"
                          placeholder="800"
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
                        placeholder="+7 (900) 000-00-00"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Электронная почта</label>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium transition"
                        placeholder="petrov@example.com"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {authError && (
                <div className="p-3.5 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                  {authError}
                </div>
              )}

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-[#1b4332] hover:bg-[#122e22] disabled:bg-[#1b4332]/50 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {authLoading ? 'Обработка...' : (isRegisterMode ? 'Зарегистрироваться' : 'Войти в кабинет')}
              </button>
            </form>

            <div className="text-center pt-2">
              <button 
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setAuthError(null);
                }}
                className="text-xs text-[#1b4332] font-bold hover:underline cursor-pointer"
              >
                {isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Впервые у нас? Регистрация садовода'}
              </button>
            </div>

            {/* Quick Testing helper */}
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-[10px] text-slate-500 space-y-1.5 font-light leading-relaxed">
              <p className="font-bold text-slate-800">🚀 Быстрый вход для тестирования:</p>
              <p>• Пользователь: <span className="font-mono font-bold bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-850">ivan</span> / пароль: <span className="font-mono font-bold bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-850">password</span> (участок №123)</p>
              <p>• Администратор: <span className="font-mono font-bold bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-850">admin</span> / пароль: <span className="font-mono font-bold bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-850">admin</span> (управляющий СНТ)</p>
            </div>
          </motion.div>
        ) : (
          /* ======================================================== */
          /* MEMBER CABINET (Authenticated screen)                     */
          /* ======================================================== */
          <motion.div 
            key="member_cabinet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-left"
          >
            {/* Logged in Welcome bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1b4332] uppercase tracking-wider">Личный кабинет садовода</span>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                  {user.fio}
                </h1>
                <p className="text-xs text-slate-400 font-light">
                  Участок №<span className="font-bold text-slate-700">{user.plotNumber}</span> • Площадь: <span className="font-semibold text-slate-800">{user.plotArea} кв.м.</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {user.isAdmin && (
                  <span className="bg-[#1b4332] text-white font-bold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full">
                    Правление СНТ
                  </span>
                )}
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-100 hover:border-rose-100 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Выйти
                </button>
              </div>
            </div>

            {/* Main dashboard columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (2 Cols): Readings and Votings */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Meter Readings Card */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
                    <Activity className="w-5 h-5 text-[#1b4332]" />
                    Передача показаний электросчетчика
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 font-light">Текущие учтенные показания:</p>
                      <p className="text-3xl font-black font-mono text-slate-900">
                        {user.meterReading.toFixed(2)} <span className="text-sm font-light text-slate-400">кВт·ч</span>
                      </p>
                      <p className="text-[11px] text-slate-500 font-light">Дневной тариф за расход: <span className="font-bold text-slate-800">5.43 ₽</span> за 1 кВт·ч</p>
                    </div>

                    <form onSubmit={handleMeterSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Новые показания (кВт·ч)</label>
                        <input 
                          type="number"
                          step="0.01"
                          required
                          value={newReading}
                          onChange={(e) => setNewReading(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white outline-none rounded-xl px-4 py-2 text-xs text-slate-900 font-bold font-mono transition"
                          placeholder={(user.meterReading + 10).toFixed(2)}
                        />
                      </div>

                      {readingError && (
                        <div className="p-2.5 bg-rose-50 text-rose-700 text-[10px] rounded-lg font-medium">
                          {readingError}
                        </div>
                      )}

                      {readingSuccess && (
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 text-[10px] rounded-lg flex items-center gap-1 font-medium border border-emerald-100 animate-fade-in">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Показания успешно переданы в СНТ «Альбатрос».
                        </div>
                      )}

                      <button 
                        type="submit"
                        disabled={readingLoading}
                        className="w-full py-2 bg-[#1b4332] hover:bg-[#122e22] disabled:bg-[#1b4332]/50 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
                      >
                        {readingLoading ? 'Отправка...' : 'Отправить показания'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Electronic Voting Card */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
                    <CheckSquare className="w-5 h-5 text-[#1b4332]" />
                    Электронное голосование садоводов
                  </h2>

                  <div className="space-y-6">
                    {votings.map((session) => {
                      const hasVoted = !!userVotedIds[session.id];
                      const votedOptionId = userVotedIds[session.id];
                      const totalVotes = session.options.reduce((sum, opt) => sum + opt.votes, 0);

                      return (
                        <div key={session.id} className="p-5 border border-slate-100 rounded-2xl space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className={`inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full mb-1.5 ${
                                session.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {session.status === 'active' ? 'Активно' : 'Завершено'}
                              </span>
                              <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                                {session.title}
                              </h3>
                            </div>

                            <div className="text-right shrink-0 text-[10px]">
                              <p className="text-slate-400 font-light">Кворум: {session.quorumCurrent}%</p>
                              <p className="text-[#1b4332] font-bold">Необходимо: {session.quorumRequired}%</p>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 font-light leading-relaxed">
                            {session.description}
                          </p>

                          <div className="space-y-3 pt-2">
                            {session.options.map((opt) => {
                              const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                              const isThisVoted = votedOptionId === opt.id;

                              return (
                                <div key={opt.id} className="space-y-1">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                      {isThisVoted && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                      {opt.text}
                                    </span>
                                    <span className="font-bold text-slate-800">{opt.votes} ({pct}%)</span>
                                  </div>

                                  {/* Visual progress bar */}
                                  <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-2 overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-500 ${isThisVoted ? 'bg-[#1b4332]' : 'bg-slate-300'}`}
                                      style={{ width: `${pct}%` }}
                                    ></div>
                                  </div>

                                  {session.status === 'active' && !hasVoted && (
                                    <button 
                                      onClick={() => handleCastVote(session.id, opt.id)}
                                      className="text-[10px] text-[#1b4332] font-bold hover:underline cursor-pointer"
                                    >
                                      Голосовать за этот вариант
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {hasVoted && (
                            <p className="text-[10px] text-emerald-800 font-bold flex items-center gap-1.5 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 animate-fade-in">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Ваш электронный голос успешно зарегистрирован по данному вопросу.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column (1 Col): Account Balance & In-App Notifications Log */}
              <div className="space-y-8">
                
                {/* Account Balance Widget */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
                    <CreditCard className="w-5 h-5 text-[#1b4332]" />
                    Баланс лицевого счета
                  </h2>

                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 font-light">Текущая задолженность по взносам и услугам:</p>
                    <p className={`text-4xl font-black font-mono ${user.balance > 0 ? 'text-rose-600' : 'text-[#1b4332]'}`}>
                      {user.balance.toFixed(2)} <span className="text-lg font-normal text-slate-400">₽</span>
                    </p>

                    {user.balance > 0 ? (
                      <form onSubmit={handlePaySubmit} className="space-y-3 pt-3 border-t border-slate-100">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Произвести оплату (симулятор)</label>
                          <input 
                            type="number"
                            required
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-[#1b4332] focus:bg-white outline-none rounded-xl px-4 py-2 text-xs text-slate-900 font-bold font-mono transition"
                            placeholder={user.balance.toFixed(0)}
                          />
                        </div>

                        {paySuccess && (
                          <div className="p-2.5 bg-emerald-50 text-emerald-800 text-[10px] rounded-lg flex items-center gap-1 font-semibold border border-emerald-100 animate-fade-in">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Баланс обновлен!
                          </div>
                        )}

                        <button 
                          type="submit"
                          disabled={payLoading}
                          className="w-full py-2 bg-[#1b4332] hover:bg-[#122e22] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
                        >
                          {payLoading ? 'Оплата...' : 'Тестовая оплата баланса'}
                        </button>
                      </form>
                    ) : (
                      <p className="text-xs text-emerald-800 font-bold bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 leading-relaxed font-light">
                        У вас нет текущих задолженностей перед СНТ! Спасибо за своевременную оплату.
                      </p>
                    )}
                  </div>
                </div>

                {/* Personal Push Notifications Log */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-3">
                    <Bell className="w-5 h-5 text-[#1b4332]" />
                    Личные уведомления
                  </h2>

                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 italic font-light">История уведомлений пуста</p>
                    ) : (
                      notifications.map((notif) => {
                        let colorClasses = 'bg-slate-50 border-slate-100';
                        if (notif.type === 'warning') colorClasses = 'bg-amber-50/70 border-amber-100 text-amber-900';
                        if (notif.type === 'success') colorClasses = 'bg-emerald-50/70 border-emerald-100 text-[#1b4332]';
                        if (notif.type === 'alert') colorClasses = 'bg-rose-50/70 border-rose-100 text-rose-900';

                        return (
                          <div key={notif.id} className={`p-3.5 border rounded-xl text-xs space-y-1 ${colorClasses} animate-fade-in`}>
                            <div className="flex justify-between items-center gap-2">
                              <span className="font-bold text-slate-800 leading-tight">
                                {notif.title}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium shrink-0">
                                {notif.date}
                              </span>
                            </div>
                            <p className="text-slate-600 font-light leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
