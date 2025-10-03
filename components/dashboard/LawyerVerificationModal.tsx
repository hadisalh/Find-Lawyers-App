import React from 'react';
import { Lawyer, LawyerStatus } from '../../types';
import { AtSymbolIcon, PhoneIcon, BriefcaseIcon, UserIcon } from '../ui/icons';

interface LawyerVerificationModalProps {
  lawyer: Lawyer;
  onClose: () => void;
  onStatusChange: (lawyerId: number, newStatus: LawyerStatus) => void;
}

export const LawyerVerificationModal: React.FC<LawyerVerificationModalProps> = ({ lawyer, onClose, onStatusChange }) => {
  const handleApprove = () => {
    onStatusChange(lawyer.id, LawyerStatus.Approved);
    onClose();
  };

  const handleReject = () => {
    onStatusChange(lawyer.id, LawyerStatus.Rejected);
    onClose();
  };

  const InfoRow: React.FC<{icon: React.ReactNode; label: string; value: string}> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
        <div className="text-slate-500">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <p className="text-md font-bold text-slate-800">{value}</p>
        </div>
    </div>
  );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">التحقق من بيانات المحامي</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light" aria-label="Close">&times;</button>
        </header>
        <main className="p-6 space-y-4">
          <InfoRow icon={<UserIcon className="w-5 h-5"/>} label="الاسم الكامل" value={lawyer.fullName} />
          <InfoRow icon={<BriefcaseIcon className="w-5 h-5"/>} label="التخصص" value={lawyer.specialty} />
          <InfoRow icon={<AtSymbolIcon />} label="البريد الإلكتروني" value={lawyer.email} />
          <InfoRow icon={<PhoneIcon />} label="رقم الهاتف" value={lawyer.phone} />
          <div>
            <a href={lawyer.idUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center p-3 bg-blue-100 text-blue-800 font-bold rounded-lg hover:bg-blue-200 transition-colors">
              عرض المستمسكات الثبوتية
            </a>
          </div>
        </main>
        <footer className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <button onClick={handleReject} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            رفض الطلب
          </button>
          <button onClick={handleApprove} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            الموافقة على الحساب
          </button>
        </footer>
      </div>
    </div>
  );
};