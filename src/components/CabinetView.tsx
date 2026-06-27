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
    <div id="cabinet_container" className="space-y-8">
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
            className="max-w-md mx-auto bg-white border border-gray-150 p-8 rounded-3xl shadow-xl space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {isRegisterMode ? 'Регистрация садовода' : 'Вход в личный кабинет'}
              </h1>
              <p className="text-xs text-gray-400">
                {isRegisterMode ? 'Создайте учетную запись участника СНТ' : 'Введите ваши учетные данные для авторизации'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Имя пользователя (логин)</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input 
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 font-medium"
                      placeholder="Например: ivan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Пароль</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {isRegisterMode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3.5 pt-2 border-t border-gray-50"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">ФИО Садовода</label>
                      <input 
                        type="text"
                        required={isRegisterMode}
                        value={fio}
                        onChange={(e) => setFio(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-4 py-2 text-sm text-gray-900 font-medium"
                        placeholder="Петров Петр Петрович"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Номер участка</label>
                        <input 
                          type="text"
                          required={isRegisterMode}
                          value={plotNumber}
                          onChange={(e) => setPlotNumber(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-4 py-2 text-sm text-gray-900 font-medium"
                          placeholder="123"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Площадь (кв.м)</label>
                        <input 
                          type="number"
                          required={isRegisterMode}
                          value={plotArea}
                          onChange={(e) => setPlotArea(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-4 py-2 text-sm text-gray-900 font-medium"
                          placeholder="800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Контактный телефон</label>
                      <input 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-4 py-2 text-sm text-gray-900 font-medium"
                        placeholder="+7 (900) 000-00-00"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Электронная почта</label>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-4 py-2 text-sm text-gray-900 font-medium"
                        placeholder="petrov@example.com"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {authError && (
                <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {authError}
                </div>
              )}

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer"
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
                className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                {isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Впервые у нас? Регистрация садовода'}
              </button>
            </div>

            {/* Quick Testing helper */}
            <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl text-[11px] text-gray-500 space-y-1">
              <p className="font-bold text-gray-700">🚀 Быстрый вход для тестирования:</p>
              <p>• Пользователь: <span className="font-mono bg-gray-200 px-1 py-0.5 rounded">ivan</span> / пароль: <span className="font-mono bg-gray-200 px-1 py-0.5 rounded">password</span> (участок №123)</p>
              <p>• Администратор: <span className="font-mono bg-gray-200 px-1 py-0.5 rounded">admin</span> / пароль: <span className="font-mono bg-gray-200 px-1 py-0.5 rounded">admin</span> (председатель СНТ)</p>
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
            className="space-y-8"
          >
            {/* Logged in Welcome bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Личный кабинет садовода</span>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                  {user.fio}
                </h1>
                <p className="text-xs text-gray-400">
                  Участок №<span className="font-bold text-gray-700">{user.plotNumber}</span> • Площадь: <span className="font-semibold text-gray-750">{user.plotArea} кв.м.</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {user.isAdmin && (
                  <span className="bg-purple-100 text-purple-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                    Администратор
                  </span>
                )}
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 border border-gray-100 hover:border-red-100 font-semibold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
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
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Передача показаний электросчетчика
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">Текущие показания в системе:</p>
                      <p className="text-3xl font-extrabold font-mono text-blue-950">
                        {user.meterReading.toFixed(2)} <span className="text-lg font-medium text-gray-400">кВт·ч</span>
                      </p>
                      <p className="text-[11px] text-gray-450">Тариф за расход: <span className="font-semibold">5.43 ₽</span> за 1 кВт·ч</p>
                    </div>

                    <form onSubmit={handleMeterSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Новые показания (кВт·ч)</label>
                        <input 
                          type="number"
                          step="0.01"
                          required
                          value={newReading}
                          onChange={(e) => setNewReading(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-3 py-2 text-sm text-gray-900 font-bold font-mono"
                          placeholder={(user.meterReading + 10).toFixed(2)}
                        />
                      </div>

                      {readingError && (
                        <div className="p-2.5 bg-red-50 text-red-700 text-[11px] rounded-lg">
                          {readingError}
                        </div>
                      )}

                      {readingSuccess && (
                        <div className="p-2.5 bg-blue-50 text-blue-800 text-[11px] rounded-lg flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-blue-600" /> Показания успешно отправлены! Начислено в квитанцию.
                        </div>
                      )}

                      <button 
                        type="submit"
                        disabled={readingLoading}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                      >
                        {readingLoading ? 'Отправка...' : 'Отправить показания'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Electronic Voting Card */}
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    Электронное голосование садоводов
                  </h2>

                  <div className="space-y-6">
                    {votings.map((session) => {
                      const hasVoted = !!userVotedIds[session.id];
                      const votedOptionId = userVotedIds[session.id];
                      const totalVotes = session.options.reduce((sum, opt) => sum + opt.votes, 0);

                      return (
                        <div key={session.id} className="p-5 border border-gray-100 rounded-2xl space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full mb-1.5 ${
                                session.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {session.status === 'active' ? 'Активно' : 'Завершено'}
                              </span>
                              <h3 className="font-bold text-gray-900 text-base leading-tight">
                                {session.title}
                              </h3>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-gray-400">Кворум: {session.quorumCurrent}%</p>
                              <p className="text-[9px] text-blue-600 font-semibold">Необходимо: {session.quorumRequired}%</p>
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 font-light leading-relaxed">
                            {session.description}
                          </p>

                          <div className="space-y-2.5">
                            {session.options.map((opt) => {
                              const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                              const isThisVoted = votedOptionId === opt.id;

                              return (
                                <div key={opt.id} className="space-y-1">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-medium text-gray-700 flex items-center gap-1.5">
                                      {isThisVoted && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                      {opt.text}
                                    </span>
                                    <span className="font-bold text-gray-800">{opt.votes} ({pct}%)</span>
                                  </div>

                                  {/* Visual progress bar */}
                                  <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-500 ${isThisVoted ? 'bg-blue-600' : 'bg-gray-300'}`}
                                      style={{ width: `${pct}%` }}
                                    ></div>
                                  </div>

                                  {session.status === 'active' && !hasVoted && (
                                    <button 
                                      onClick={() => handleCastVote(session.id, opt.id)}
                                      className="text-[10px] text-blue-600 font-semibold hover:underline"
                                    >
                                      Голосовать за этот вариант
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {hasVoted && (
                            <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 bg-blue-50/50 p-2 rounded-xl border border-blue-100">
                              <Check className="w-4 h-4" /> Ваш электронный голос успешно зарегистрирован по данному вопросу.
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
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Баланс лицевого счета
                  </h2>

                  <div className="space-y-3">
                    <p className="text-xs text-gray-400">Текущая задолженность по взносам и услугам:</p>
                    <p className={`text-4xl font-extrabold font-mono ${user.balance > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                      {user.balance.toFixed(2)} <span className="text-lg font-medium text-gray-400">₽</span>
                    </p>

                    {user.balance > 0 ? (
                      <form onSubmit={handlePaySubmit} className="space-y-2 pt-2 border-t border-gray-50">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Оплатить онлайн (симулятор)</label>
                          <input 
                            type="number"
                            required
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white outline-none rounded-xl px-3 py-1.5 text-xs text-gray-900 font-bold"
                            placeholder={user.balance.toFixed(0)}
                          />
                        </div>

                        {paySuccess && (
                          <div className="p-2 bg-blue-50 text-blue-800 text-[10px] rounded-lg flex items-center gap-1">
                            <Check className="w-3 h-3 text-blue-600" /> Баланс обновлен!
                          </div>
                        )}

                        <button 
                          type="submit"
                          disabled={payLoading}
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                        >
                          {payLoading ? 'Оплата...' : 'Произвести тестовую оплату'}
                        </button>
                      </form>
                    ) : (
                      <p className="text-xs text-blue-600 font-semibold bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        У вас нет текущих задолженностей перед СНТ! Спасибо за своевременную оплату.
                      </p>
                    )}
                  </div>
                </div>

                {/* Personal Push Notifications Log */}
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Личные уведомления
                  </h2>

                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">История уведомлений пуста</p>
                    ) : (
                      notifications.map((notif) => {
                        let colorClasses = 'bg-gray-50 border-gray-100';
                        if (notif.type === 'warning') colorClasses = 'bg-amber-50/70 border-amber-100 text-amber-900';
                        if (notif.type === 'success') colorClasses = 'bg-blue-50/70 border-blue-100 text-blue-900';
                        if (notif.type === 'alert') colorClasses = 'bg-red-50/70 border-red-100 text-red-900';

                        return (
                          <div key={notif.id} className={`p-3 border rounded-xl text-xs space-y-1 ${colorClasses}`}>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-800 leading-tight">
                                {notif.title}
                              </span>
                              <span className="text-[9px] text-gray-400 font-medium shrink-0">
                                {notif.date}
                              </span>
                            </div>
                            <p className="text-gray-600 font-light leading-relaxed">
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
