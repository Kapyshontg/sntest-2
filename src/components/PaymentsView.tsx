import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Calculator, FileText, Download, Wallet, CreditCard } from 'lucide-react';
import SEOHead from './SEOHead';

export default function PaymentsView() {
  const [sotki, setSotki] = useState<string>('8');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Hardcoded bank details
  const bankDetails = {
    recipient: "СНТ «Альбатрос»",
    inn: "5040012345",
    kpp: "504001001",
    bank: "АО «АЛЬФА-БАНК»",
    bik: "044525593",
    corrAccount: "30101810200000000593",
    account: "40703810402860001234",
    purpose: "Оплата членских взносов за 2026 год, уч. №___",
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  // Calculations
  const numSotki = Number(sotki) || 0;
  const yearlyFee = numSotki * 1500;
  const targetRoadsFee = numSotki * 500;
  const totalDue = yearlyFee + targetRoadsFee;

  // Documents available for download
  const documents = [
    { name: "Приходно-расходная смета СНТ на 2026 год.pdf", size: "1.4 МБ", date: "15.05.2025" },
    { name: "Устав СНТ «Альбатрос» в новой редакции от 2024 года.pdf", size: "3.2 МБ", date: "22.06.2024" },
    { name: "Бланк квитанции на оплату членских взносов.docx", size: "145 КБ", date: "10.01.2026" },
    { name: "Протокол общего собрания садоводов №3.pdf", size: "850 КБ", date: "12.04.2025" },
  ];

  return (
    <div id="payments_container" className="space-y-10 animate-fade-in">
      <SEOHead 
        title="Взносы и реквизиты — СНТ «Альбатрос»"
        description="Банковские реквизиты СНТ «Альбатрос» для оплаты членских и целевых взносов. Онлайн калькулятор членского взноса и скачивание официальных бланков квитанций."
        keywords="реквизиты СНТ Альбатрос, оплата взносов, калькулятор взносов СНТ, квитанция СНТ"
      />

      {/* Header section with left accent line */}
      <section className="space-y-4 max-w-4xl text-left">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Взносы и платежные реквизиты
        </h1>
        <div className="flex gap-4 items-stretch">
          <div className="w-1.5 bg-[#1b4332] rounded-full shrink-0"></div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light py-0.5">
            Все платежи в товариществе осуществляются исключительно в безналичной форме на расчетный счет СНТ «Альбатрос» в соответствии с Федеральным законом № 217-ФЗ.
          </p>
        </div>
      </section>

      {/* Dynamic Membership Fee Calculator and bank details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Interactive Calculator */}
        <div id="calc_block" className="bg-emerald-50/40 border border-emerald-100 p-6 rounded-2xl shadow-inner-sm space-y-5 text-left">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#1b4332]" />
            Калькулятор взносов
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Площадь вашего участка (в сотках)
              </label>
              <input 
                id="calc_input_sotki"
                type="number"
                min="1"
                max="100"
                value={sotki}
                onChange={(e) => setSotki(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-[#1b4332] focus:ring-1 focus:ring-[#1b4332] outline-none rounded-xl px-4 py-3 text-slate-900 font-bold text-sm transition"
                placeholder="Например: 8"
              />
            </div>

            <div className="border-t border-slate-200/50 pt-4 space-y-3">
              <div className="flex justify-between text-xs text-slate-600 font-light">
                <span>Членский взнос (1500 ₽ / сотка):</span>
                <span className="font-bold text-slate-900">{yearlyFee.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 font-light">
                <span>Целевой взнос на дороги (500 ₽ / сотка):</span>
                <span className="font-bold text-slate-900">{targetRoadsFee.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200/50 pt-3">
                <span>Итого к оплате:</span>
                <span className="text-[#1b4332]">{totalDue.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 leading-relaxed font-light">
              * Данный расчет является справочным. Точную сумму вашей текущей задолженности, переплат и пени смотрите в Личном кабинете после прохождения авторизации.
            </div>
          </div>
        </div>

        {/* Right Col: Bank Details with Copy-To-Clipboard */}
        <div id="bank_details_block" className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5 text-left">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#1b4332]" />
              Банковские реквизиты СНТ
            </h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Кликните на поле для копирования</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-4">
              <div 
                onClick={() => copyToClipboard(bankDetails.recipient, 'recipient')}
                className="group cursor-pointer p-3 bg-slate-50/50 hover:bg-emerald-50/20 rounded-xl transition relative border border-transparent hover:border-emerald-100"
              >
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Получатель платежа</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{bankDetails.recipient}</span>
                  {copiedField === 'recipient' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => copyToClipboard(bankDetails.inn, 'inn')}
                  className="group cursor-pointer p-3 bg-slate-50/50 hover:bg-emerald-50/20 rounded-xl transition relative border border-transparent hover:border-emerald-100"
                >
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">ИНН</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{bankDetails.inn}</span>
                    {copiedField === 'inn' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition" />}
                  </div>
                </div>

                <div 
                  onClick={() => copyToClipboard(bankDetails.kpp, 'kpp')}
                  className="group cursor-pointer p-3 bg-slate-50/50 hover:bg-emerald-50/20 rounded-xl transition relative border border-transparent hover:border-emerald-100"
                >
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">КПП</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{bankDetails.kpp}</span>
                    {copiedField === 'kpp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition" />}
                  </div>
                </div>
              </div>

              <div 
                onClick={() => copyToClipboard(bankDetails.bank, 'bank')}
                className="group cursor-pointer p-3 bg-slate-50/50 hover:bg-emerald-50/20 rounded-xl transition relative border border-transparent hover:border-emerald-100"
              >
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Банк получателя</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{bankDetails.bank}</span>
                  {copiedField === 'bank' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => copyToClipboard(bankDetails.bik, 'bik')}
                className="group cursor-pointer p-3 bg-slate-50/50 hover:bg-emerald-50/20 rounded-xl transition relative border border-transparent hover:border-emerald-100"
              >
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">БИК</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{bankDetails.bik}</span>
                  {copiedField === 'bik' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />}
                </div>
              </div>

              <div 
                onClick={() => copyToClipboard(bankDetails.account, 'account')}
                className="group cursor-pointer p-3 bg-slate-50/50 hover:bg-emerald-50/20 rounded-xl transition relative border border-transparent hover:border-emerald-100"
              >
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Расчетный счет</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-slate-900">{bankDetails.account}</span>
                  {copiedField === 'account' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />}
                </div>
              </div>

              <div 
                onClick={() => copyToClipboard(bankDetails.corrAccount, 'corrAccount')}
                className="group cursor-pointer p-3 bg-slate-50/50 hover:bg-emerald-50/20 rounded-xl transition relative border border-transparent hover:border-emerald-100"
              >
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Корреспондентский счет</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-slate-800">{bankDetails.corrAccount}</span>
                  {copiedField === 'corrAccount' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />}
                </div>
              </div>
            </div>

          </div>

          {/* Purpose of payment */}
          <div 
            onClick={() => copyToClipboard(bankDetails.purpose, 'purpose')}
            className="group cursor-pointer p-3.5 bg-emerald-50/30 hover:bg-emerald-50/50 border border-dashed border-emerald-200 rounded-xl transition flex items-center justify-between"
          >
            <div>
              <p className="text-[9px] text-emerald-800 uppercase font-bold tracking-wider mb-1">Назначение платежа (образец)</p>
              <span className="text-xs font-semibold text-slate-700">{bankDetails.purpose}</span>
            </div>
            {copiedField === 'purpose' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition" />}
          </div>
        </div>

      </div>

      {/* Sberbank instructions and official documents download */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Instruction block */}
        <div id="instructions_block" className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 text-left">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-50 pb-3">
            <CreditCard className="w-4.5 h-4.5 text-[#1b4332]" />
            Как оплатить онлайн?
          </h3>
          
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-light">
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-55/30 text-[#1b4332] flex items-center justify-center font-bold shrink-0 text-[10px]">1</span>
              <p>Зайдите в мобильное приложение <span className="font-bold text-slate-800">Сбербанк Онлайн</span> или вашего банка.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-55/30 text-[#1b4332] flex items-center justify-center font-bold shrink-0 text-[10px]">2</span>
              <p>Перейдите в раздел <span className="font-bold text-slate-800">«Платежи»</span> → <span className="font-bold text-slate-800">«Оплата по реквизитам»</span>.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-55/30 text-[#1b4332] flex items-center justify-center font-bold shrink-0 text-[10px]">3</span>
              <p>Введите ИНН <span className="font-bold font-mono text-slate-800">5040012345</span> и расчетный счет СНТ.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-55/30 text-[#1b4332] flex items-center justify-center font-bold shrink-0 text-[10px]">4</span>
              <p>Укажите ФИО плательщика, номер вашего участка и назначение платежа.</p>
            </div>
          </div>
        </div>

        {/* Official Documents Downloads */}
        <div id="documents_block" className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 text-left">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-50 pb-3">
            <FileText className="w-4.5 h-4.5 text-[#1b4332]" />
            Официальные документы и бланки
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map((doc, idx) => (
              <div key={idx} className="p-3.5 border border-slate-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50/10 transition flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px]" title={doc.name}>
                    {doc.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-light">
                    {doc.size} • {doc.date}
                  </p>
                </div>
                
                {/* Simulated direct download action */}
                <button 
                  onClick={() => alert(`Симуляция загрузки файла: ${doc.name}`)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#1b4332] transition cursor-pointer"
                  title="Скачать файл"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
