import React, { useState, useEffect } from 'react';
import { User, UserRole, Lawyer, Client, Admin, LawyerSpecialty, LawyerStatus, AccountStatus } from '../../types';

interface EditUserModalProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onClose: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue)) {
        setFormData(prev => ({ ...prev, [name]: numValue }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };
  
  const commonInputClasses = "w-full p-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition";

  const renderLawyerFields = () => {
    if (formData.role !== UserRole.Lawyer) return null;
    const lawyerData = formData as Lawyer;
    return (
      <>
        <div>
          <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-2">التخصص</label>
          <select name="specialty" value={lawyerData.specialty} onChange={handleChange} className={commonInputClasses}>
            {Object.values(LawyerSpecialty).map(spec => <option key={spec} value={spec}>{spec}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-2">حالة الحساب (المراجعة)</label>
          <select name="status" value={lawyerData.status} onChange={handleChange} className={commonInputClasses}>
             {Object.values(LawyerStatus).map(stat => <option key={stat} value={stat}>{stat}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-2">القضايا الرابحة</label>
          <input type="number" name="wonCases" value={lawyerData.wonCases} onChange={handleNumericChange} className={commonInputClasses} />
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200">تعديل بيانات المستخدم</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 text-3xl font-light" aria-label="Close">&times;</button>
        </header>
        <main className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-2">الاسم الكامل</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={commonInputClasses} />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-2">البريد الإلكتروني</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={commonInputClasses} />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-2">رقم الهاتف</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={commonInputClasses} />
          </div>
           <div>
            <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-2">كلمة المرور (اتركه فارغاً لعدم التغيير)</label>
            <input type="password" name="password" value={formData.password || ''} onChange={handleChange} placeholder="••••••••" className={commonInputClasses} />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-2">حالة الحساب (عام)</label>
            <select name="accountStatus" value={formData.accountStatus} onChange={handleChange} className={commonInputClasses}>
              {Object.values(AccountStatus).map(stat => <option key={stat} value={stat}>{stat}</option>)}
            </select>
          </div>
          {renderLawyerFields()}
        </main>
        <footer className="p-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-xl">
          <button onClick={onClose} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
            إلغاء
          </button>
          <button onClick={handleSave} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            حفظ التغييرات
          </button>
        </footer>
      </div>
    </div>
  );
};
