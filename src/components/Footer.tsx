import React from 'react';
import { Landmark, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer id="app_footer" className="bg-gray-900 text-gray-400 border-t border-gray-800 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Col 1: SNT branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Landmark className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-base">СНТ «Альбатрос»</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Официальный информационный интернет-портал товарищества. Прозрачное управление, передача показаний и онлайн-оплата взносов.
          </p>
        </div>

        {/* Col 2: Navigation map */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Разделы сайта</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => onNavigate('home')} className="text-left hover:text-white transition cursor-pointer">Главная</button>
            <button onClick={() => onNavigate('payments')} className="text-left hover:text-white transition cursor-pointer">Взносы и реквизиты</button>
            <button onClick={() => onNavigate('contacts')} className="text-left hover:text-white transition cursor-pointer">Контакты</button>
            <button onClick={() => onNavigate('cabinet')} className="text-left hover:text-white transition cursor-pointer">Личный кабинет</button>
          </div>
        </div>

        {/* Col 3: Legals & FZ-217 */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Соответствие 217-ФЗ</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed font-light">
            Сайт разработан в соответствии с требованиями Федерального закона от 29.07.2017 № 217-ФЗ «О ведении гражданами садоводства и огородничества для собственных нужд».
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 mt-10 pt-6 text-center text-[10px] text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© {new Date().getFullYear()} СНТ «Альбатрос». Все права защищены.</p>
        <p>Разработка и поддержка официального портала садоводов</p>
      </div>
    </footer>
  );
}
