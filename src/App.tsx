import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Volume2, VolumeX } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import DocumentsView from './components/DocumentsView';
import PaymentsView from './components/PaymentsView';
import InfrastructureView from './components/InfrastructureView';
import ContactsView from './components/ContactsView';
import CabinetView from './components/CabinetView';
import AdminView from './components/AdminView';
import { User, Notification, NewsItem, SntStats } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [token, setToken] = useState<string | null>(localStorage.getItem('snt_token'));
  const [user, setUser] = useState<User | null>(null);

  // Core SNT data
  const [news, setNews] = useState<NewsItem[]>([]);
  const [stats, setStats] = useState<SntStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Real-time Push Alert states
  const [activePush, setActivePush] = useState<Notification | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);

  // Load User Profile on startup/token change
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            // Token stale or invalid
            handleLogout();
          }
        })
        .catch(() => handleLogout());
    } else {
      setUser(null);
    }
  }, [token]);

  // Fetch News and Stats on Load
  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error(err));

    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  // Fetch/Poll Notifications dynamically
  const fetchNotifications = () => {
    const plotQuery = user ? `?plot=${user.plotNumber}` : '';
    fetch(`/api/notifications${plotQuery}`)
      .then(res => res.json())
      .then((data: Notification[]) => {
        setNotifications(data);

        // Check if there's a brand new notification to push!
        if (data.length > 0) {
          const latest = data[0];
          // If we haven't seen this notification yet during the current session
          if (lastNotificationId && latest.id !== lastNotificationId) {
            // Trigger push toaster alert
            setActivePush(latest);
            // Play a soft notification chime if enabled
            if (soundEnabled) {
              playPushChime();
            }
          }
          setLastNotificationId(latest.id);
        }
      })
      .catch(err => console.error(err));
  };

  // Poll for notifications every 4 seconds to implement Custom Push Notifications
  useEffect(() => {
    fetchNotifications(); // initial load
    const interval = setInterval(fetchNotifications, 4000);
    return () => clearInterval(interval);
  }, [user, lastNotificationId, soundEnabled]);

  const playPushChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      // Pleasant twin chime
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5

      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio Context block:', e);
    }
  };

  const handleLogin = (newToken: string, newUser: User) => {
    localStorage.setItem('snt_token', newToken);
    setToken(newToken);
    setUser(newUser);
    setCurrentTab('cabinet');
  };

  const handleLogout = () => {
    localStorage.removeItem('snt_token');
    setToken(null);
    setUser(null);
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Dynamic Header Component */}
      <Header 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main viewport with motion layout transition */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {currentTab === 'home' && (
              <HomeView 
                news={news}
                stats={stats}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'documents' && (
              <DocumentsView onNavigate={setCurrentTab} />
            )}

            {currentTab === 'payments' && (
              <PaymentsView />
            )}

            {currentTab === 'infrastructure' && (
              <InfrastructureView />
            )}

            {currentTab === 'contacts' && (
              <ContactsView />
            )}

            {currentTab === 'cabinet' && (
              <CabinetView 
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
                notifications={notifications}
                onRefreshNotifications={fetchNotifications}
              />
            )}

            {currentTab === 'admin' && (
              <AdminView 
                notifications={notifications}
                onRefreshNotifications={fetchNotifications}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Footer Component */}
      <Footer onNavigate={setCurrentTab} />

      {/* Custom Push Notification Toaster Alert */}
      <AnimatePresence>
        {activePush && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-gray-150 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Top push accent based on notification type */}
            <div className={`h-1.5 w-full ${
              activePush.type === 'warning' ? 'bg-amber-500' :
              activePush.type === 'success' ? 'bg-blue-600' :
              activePush.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
            }`} />

            <div className="p-4 flex gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${
                activePush.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                activePush.type === 'success' ? 'bg-blue-50 text-blue-600' :
                activePush.type === 'alert' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <Bell className="w-5 h-5 animate-bounce" />
              </div>

              <div className="flex-grow space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 leading-none">
                    {activePush.title}
                  </span>
                  <button 
                    onClick={() => setActivePush(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                  {activePush.message}
                </p>
                
                {/* Audio feedback indicator */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] text-gray-400">Всплывающее push-уведомление</span>
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-[9px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title={soundEnabled ? "Выключить звук" : "Включить звук"}
                  >
                    {soundEnabled ? <><Volume2 className="w-3 h-3" /> Звук активен</> : <><VolumeX className="w-3 h-3 text-gray-400" /> Без звука</>}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
