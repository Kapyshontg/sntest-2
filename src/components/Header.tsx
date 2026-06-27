import React from 'react';
import { Landmark, User as UserIcon, ShieldAlert, Bell, Menu, X } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
}

export default function Header({ currentTab, onTabChange, user, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'documents', label: 'Документы' },
    { id: 'payments', label: 'Взносы' },
    { id: 'infrastructure', label: 'Инфраструктура' },
    { id: 'contacts', label: 'Контакты' },
  ];

  if (user?.isAdmin) {
    navItems.push({ id: 'admin', label: 'Панель правления' });
  }

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header id="app_header" className="bg-white border-b border-slate-100 sticky top-0 z-50">
      
      {/* Top Banner Alert (Important Announcement) */}
      <div id="top_urgent_banner" className="bg-[#fee2e2] border-b border-red-100 text-red-700 py-2.5 px-4 text-center text-[11px] md:text-xs font-bold flex items-center justify-center gap-2 shadow-inner">
        <Bell className="w-4 h-4 animate-swing shrink-0 text-red-600" />
        <span>Важное объявление: Общее собрание членов СНТ Альбатрос состоится 25 мая в 12:00. Ознакомьтесь с повесткой в кабинете.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-200">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-slate-900 tracking-tight block underline underline-offset-4 decoration-[#1b4332]">СНТ «Альбатрос»</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-none">Рузский г.о., Московская обл.</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop_nav" className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer relative ${
                    isActive 
                      ? 'bg-emerald-50 text-[#1b4332]' 
                      : 'text-slate-500 hover:text-[#1b4332] hover:bg-slate-50/70'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#1b4332] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Area: Profile indicator (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div 
                onClick={() => handleNavClick('cabinet')}
                className={`flex items-center gap-2 px-3 py-1.5 bg-slate-50 border rounded-xl cursor-pointer hover:border-emerald-200 transition ${
                  currentTab === 'cabinet' ? 'border-[#1b4332] bg-emerald-50/20' : 'border-slate-100'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-[#1b4332] text-white flex items-center justify-center text-xs font-bold">
                  {user.plotNumber}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-800 leading-tight truncate max-w-[100px]">{user.fio.split(' ')[0]}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">Лицевой счет</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('cabinet')}
                className={`px-5 py-2.5 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm ${
                  currentTab === 'cabinet' 
                    ? 'bg-[#1b4332] text-white hover:bg-[#153527]' 
                    : 'bg-[#0f172a] text-white hover:bg-slate-800'
                }`}
              >
                Личный кабинет
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile_nav_dropdown" className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1.5 shadow-xl animate-slide-down">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-50 text-[#1b4332]' 
                    : 'text-slate-500 hover:text-[#1b4332] hover:bg-slate-50/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            {user ? (
              <div 
                onClick={() => handleNavClick('cabinet')}
                className="flex items-center gap-2 cursor-pointer w-full p-1 hover:bg-slate-50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1b4332] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.plotNumber}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-800 block">{user.fio}</span>
                  <span className="text-[9px] text-slate-400 font-semibold block uppercase">Лицевой счет</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('cabinet')}
                className="w-full text-center py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow"
              >
                Личный кабинет
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
