import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Globe, Download, Eye, Folder, Lock, ChevronRight, Mail, Info, FileCode, CheckCircle, ShieldAlert } from 'lucide-react';
import SEOHead from './SEOHead';

interface FileItem {
  name: string;
  date: string;
  size: string;
  type: 'pdf' | 'doc' | 'xls';
}

interface FolderData {
  id: string;
  name: string;
  files: FileItem[];
}

interface DocumentsViewProps {
  onNavigate: (tab: string) => void;
}

export default function DocumentsView({ onNavigate }: DocumentsViewProps) {
  const [activeFolderId, setActiveFolderId] = useState<string>('protocols');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const folders: FolderData[] = [
    {
      id: 'protocols',
      name: 'Протоколы ОС',
      files: [
        { name: 'Протокол ОС №1 от 15.05.2024.pdf', date: '16 мая 2024', size: '1.2 MB', type: 'pdf' },
        { name: 'Решение правления №4 (Вывоз мусора).pdf', date: '10 мая 2024', size: '850 KB', type: 'pdf' },
        { name: 'Приложение №1 к протоколу ОС.docx', date: '15 мая 2024', size: '124 KB', type: 'doc' },
      ]
    },
    {
      id: 'estimates',
      name: 'Сметы и ФЭО',
      files: [
        { name: 'Приходно-расходная смета СНТ на 2026 год.pdf', date: '15 мая 2025', size: '1.4 MB', type: 'pdf' },
        { name: 'Финансово-экономическое обоснование взносов 2026.pdf', date: '12 мая 2025', size: '950 KB', type: 'pdf' },
        { name: 'Отчет об исполнении сметы за прошлый период.xlsx', date: '01 мая 2025', size: '320 KB', type: 'xls' },
      ]
    },
    {
      id: 'audits',
      name: 'Акты ревизионной комиссии',
      files: [
        { name: 'Акт проверки финансовой деятельности за 2024 год.pdf', date: '20 апреля 2025', size: '1.8 MB', type: 'pdf' },
        { name: 'Заключение ревизионной комиссии по проекту сметы.pdf', date: '22 апреля 2025', size: '620 KB', type: 'pdf' },
      ]
    },
    {
      id: 'reports',
      name: 'Отчеты председателя',
      files: [
        { name: 'Отчет председателя правления за 2024 год.pdf', date: '15 апреля 2025', size: '2.1 MB', type: 'pdf' },
        { name: 'План развития территории СНТ на 2025-2026 гг.pdf', date: '10 апреля 2025', size: '1.1 MB', type: 'pdf' },
      ]
    },
  ];

  const publicDocs = [
    {
      title: 'Устав СНТ (2026)',
      desc: 'Действующая редакция главного учредительного документа товарищества.',
      actionText: 'Скачать PDF',
      icon: FileText,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Свидетельство ИНН/ОГРН',
      desc: 'Официальные регистрационные документы юридического лица СНТ «Альбатрос».',
      actionText: 'Посмотреть',
      icon: Globe,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Реквизиты для оплаты',
      desc: 'Официальный бланк с банковскими реквизитами для перечислений.',
      actionText: 'Скачать реквизиты',
      icon: FileCode,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Бланки заявлений',
      desc: 'Шаблоны заявлений на вступление в члены СНТ, проведение работ и др.',
      actionText: 'Открыть архив',
      icon: Folder,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    },
  ];

  const activeFolder = folders.find(f => f.id === activeFolderId) || folders[0];

  const handleDownloadSimulation = (fileName: string) => {
    setCopiedFile(fileName);
    setTimeout(() => {
      setCopiedFile(null);
    }, 2000);
  };

  return (
    <div id="documents_container" className="space-y-10">
      <SEOHead 
        title="Документы и Отчетность — СНТ «Альбатрос»"
        description="Официальный архив документов СНТ «Альбатрос». Устав СНТ, ОГРН, реквизиты, приходно-расходные сметы, протоколы общих собраний членов товарищества."
        keywords="устав СНТ Альбатрос, сметы СНТ, протоколы собраний, документы товарищества"
      />

      {/* Header section with left accent line */}
      <section className="space-y-4 max-w-4xl">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Документы и отчетность
        </h1>
        <div className="flex gap-4 items-stretch">
          <div className="w-1.5 bg-[#1b4332] rounded-full shrink-0"></div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light py-0.5">
            Мы придерживаемся политики полной прозрачности в управлении товариществом. Каждый член СНТ «Альбатрос» имеет законное право ознакомиться со всеми финансовыми, юридическими и административными документами правления.
          </p>
        </div>
      </section>

      {/* Public Documents Grid */}
      <section className="space-y-5">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#1b4332]" />
          Публичные документы
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {publicDocs.map((doc, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-250 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${doc.color}`}>
                  <doc.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-[#1b4332] transition">
                  {doc.title}
                </h3>
                <p className="text-slate-500 text-xs font-light leading-relaxed">
                  {doc.desc}
                </p>
              </div>

              <button 
                onClick={() => {
                  if (doc.title.includes('Реквизиты')) {
                    onNavigate('payments');
                  } else {
                    handleDownloadSimulation(doc.title);
                  }
                }}
                className="text-xs font-semibold text-[#1b4332] hover:text-[#112a1f] flex items-center gap-1.5 group/btn cursor-pointer pt-2"
              >
                {doc.title.includes('ИНН') || doc.title.includes('Бланки') ? (
                  <Eye className="w-4 h-4 text-slate-400 group-hover/btn:text-[#1b4332] transition" />
                ) : (
                  <Download className="w-4 h-4 text-slate-400 group-hover/btn:text-[#1b4332] transition" />
                )}
                <span>{doc.actionText}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Electronic Archive Section */}
      <section className="space-y-5">
        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Header of Archive */}
          <div className="p-5 md:p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-3 items-center">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-[#1b4332] shadow-sm">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">
                  Электронный архив (Google Drive)
                </h3>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Удобная навигация по внутренним документам и протоколам собраний.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-100 text-[10px] font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> Доступ ограничен
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Sidebar folders list */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-100 p-4 md:p-5 space-y-2 bg-slate-50/40">
              {folders.map((folder) => {
                const isActive = folder.id === activeFolderId;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFolderId(folder.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-between group cursor-pointer ${
                      isActive 
                        ? 'bg-[#1b4332] text-white shadow-md' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/75 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#1b4332]'}`} />
                      <span>{folder.name}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'translate-x-0.5 text-white' : 'text-slate-300 group-hover:text-slate-500'}`} />
                  </button>
                );
              })}

              <div className="pt-6 mt-6 border-t border-slate-100 border-dashed">
                <div className="p-4 bg-amber-55/30 border border-dashed border-amber-200 rounded-xl text-[11px] text-slate-600 space-y-1.5">
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Внимание
                  </p>
                  <p className="leading-relaxed font-light">
                    Доступ к архиву предоставляется только верифицированным членам СНТ по запросу:
                  </p>
                  <a href="mailto:info@snt-albatros.ru" className="font-bold text-[#1b4332] hover:underline block pt-0.5">
                    info@snt-albatros.ru
                  </a>
                </div>
              </div>
            </div>

            {/* Right side files list table */}
            <div className="lg:col-span-8 p-5 md:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Файлы папки: {activeFolder.name}</span>
                <span className="text-xs text-slate-400 font-medium">{activeFolder.files.length} док.</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2">
                      <th className="py-2.5 font-bold">Наименование</th>
                      <th className="py-2.5 font-bold">Дата изменения</th>
                      <th className="py-2.5 font-bold">Размер</th>
                      <th className="py-2.5 text-right font-bold">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs">
                    {activeFolder.files.map((file, fIdx) => (
                      <tr key={fIdx} className="hover:bg-slate-50/50 group transition duration-150">
                        <td className="py-3.5 pr-3 font-semibold text-slate-850 flex items-center gap-2">
                          <FileText className={`w-4 h-4 shrink-0 ${
                            file.type === 'pdf' ? 'text-red-500' :
                            file.type === 'doc' ? 'text-blue-500' : 'text-emerald-500'
                          }`} />
                          <span className="truncate max-w-[220px] sm:max-w-xs md:max-w-md" title={file.name}>
                            {file.name}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-500 font-light">{file.date}</td>
                        <td className="py-3.5 text-slate-400 font-light">{file.size}</td>
                        <td className="py-3.5 text-right">
                          <button 
                            onClick={() => handleDownloadSimulation(file.name)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#1b4332] transition cursor-pointer"
                            title="Скачать файл"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {copiedFile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  Скачивание файла «{copiedFile}» начнется автоматически.
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Inquiry Callout Banner */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl overflow-hidden shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
            alt="СНТ Администрация"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl text-left">
          <h3 className="text-xl font-bold tracking-tight md:text-2xl">
            Не нашли нужный документ?
          </h3>
          <p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed">
            Вы можете отправить официальный запрос в правление СНТ на получение копий документов. Мы подготовим их в течение 30 дней в соответствии с регламентом.
          </p>
        </div>

        <div className="relative z-10 shrink-0 flex flex-wrap gap-3">
          <button 
            onClick={() => onNavigate('contacts')}
            className="px-5 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#153527] text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Mail className="w-4 h-4" /> Написать запрос
          </button>
          <button 
            onClick={() => alert('Порядок выдачи справок: Запросы принимаются от членов СНТ в письменном виде или через форму обратной связи. Срок обработки до 30 рабочих дней. Копии предоставляются бесплатно.')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/35 transition font-semibold text-xs text-white cursor-pointer"
          >
            Порядок выдачи справок
          </button>
        </div>
      </section>
    </div>
  );
}
