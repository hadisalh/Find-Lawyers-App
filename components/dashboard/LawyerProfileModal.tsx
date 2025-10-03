import React from 'react';
import { Lawyer } from '../../types';
import { StarIcon, BriefcaseIcon, UserIcon, ChatIcon } from '../ui/icons';

interface LawyerProfileModalProps {
  lawyer: Lawyer;
  onClose: () => void;
  onStartChat: (lawyerId: number) => void;
}

export const LawyerProfileModal: React.FC<LawyerProfileModalProps> = ({ lawyer, onClose, onStartChat }) => {
  const handleStartChatClick = () => {
    onStartChat(lawyer.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">الملف الشخصي للمحامي</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light" aria-label="Close">&times;</button>
        </header>
        
        <main className="p-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-6 mb-8">
            <div className="bg-slate-100 p-4 rounded-full border border-slate-200">
              <UserIcon className="w-20 h-20 text-slate-500" />
            </div>
            <div className="flex-grow">
              <h3 className="text-4xl font-extrabold text-gray-900">{lawyer.fullName}</h3>
              <p className="text-xl text-blue-600 font-semibold mt-1">{lawyer.specialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <StarIcon className="w-10 h-10 text-yellow-400" />
              <div>
                <p className="font-extrabold text-2xl text-gray-800">{lawyer.rating.toFixed(1)}</p>
                <p className="text-md text-gray-700">التقييم العام</p>
              </div>
            </div>
             <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <BriefcaseIcon className="w-10 h-10 text-green-600" />
              <div>
                <p className="font-extrabold text-2xl text-gray-800">{lawyer.wonCases}</p>
                <p className="text-md text-gray-700">قضية ناجحة</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-4">آراء العملاء ({lawyer.reviews.length})</h4>
            <div className="space-y-4 max-h-48 overflow-y-auto -mr-2 pr-2">
              {lawyer.reviews.length > 0 ? (
                lawyer.reviews.map((review, index) => (
                  <blockquote key={index} className="bg-white border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-gray-700 italic">"{review}"</p>
                  </blockquote>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">لا توجد مراجعات متاحة حالياً.</p>
              )}
            </div>
          </div>
        </main>
        
        <footer className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-2xl">
           <button 
              onClick={handleStartChatClick}
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <ChatIcon className="w-5 h-5" />
              بدء محادثة خاصة
            </button>
        </footer>
      </div>
    </div>
  );
};