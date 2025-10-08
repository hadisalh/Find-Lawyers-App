
import React from 'react';

interface DisclaimerProps {
  onAgree: () => void;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ onAgree }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8 max-w-lg w-full mx-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">إخلاء مسؤولية</h2>
        <p className="text-gray-600 dark:text-slate-400 mb-6">
          نحن غير مسؤولين عن أي تعامل مالي أو قانوني بين العميل والمحامي. دورنا يقتصر على تسهيل التواصل بين الطرفين.
        </p>
        <button
          onClick={onAgree}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
        >
          أوافق وأتابع
        </button>
      </div>
    </div>
  );
};