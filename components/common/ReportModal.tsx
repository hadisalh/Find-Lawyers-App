import React, { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  targetName: string;
  targetType: 'user' | 'post' | 'message';
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, targetName, targetType }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason.trim() === '') {
      alert('يرجى كتابة سبب الإبلاغ.');
      return;
    }
    onSubmit(reason);
    setReason('');
  };
  
  const targetTypeText = targetType === 'user' ? 'المستخدم' : targetType === 'post' ? 'المنشور' : 'الرسالة';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200">الإبلاغ عن {targetTypeText}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 text-3xl font-light" aria-label="Close">&times;</button>
        </header>
        <main className="p-6 space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            أنت على وشك الإبلاغ عن {targetTypeText}: <strong className="text-slate-800 dark:text-slate-100 break-all">"{targetName}"</strong>.
          </p>
          <div>
            <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-2">سبب الإبلاغ</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="يرجى توضيح سبب الإبلاغ..."
              className="w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 transition"
              rows={5}
            ></textarea>
          </div>
        </main>
        <footer className="p-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-xl">
          <button onClick={onClose} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
            إلغاء
          </button>
          <button onClick={handleSubmit} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            إرسال البلاغ
          </button>
        </footer>
      </div>
    </div>
  );
};