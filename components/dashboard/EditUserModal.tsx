import React, { useState, useEffect } from 'react';
import { User, UserRole, Lawyer, Client, LawyerSpecialty } from '../../types';

interface EditUserModalProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onClose: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onSave, onClose }) => {
  // FIX: Using `any` for formData state to resolve complex union type issues with form handling.
  // The original type `Partial<Lawyer & Client>` resolved to `never`.
  const [formData, setFormData] = useState<any>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const dataToSave = { ...formData };
    if (dataToSave.role === UserRole.Lawyer && typeof dataToSave.wonCases === 'string') {
        dataToSave.wonCases = parseInt(dataToSave.wonCases, 10) || 0;
    }
    onSave(dataToSave as User);
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">تعديل بيانات {user.role === UserRole.Lawyer ? 'المحامي' : 'العميل'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light" aria-label="Close">&times;</button>
        </header>
        <main className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل</label>
            <input type="text" name="fullName" value={formData.fullName || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">رقم الهاتف</label>
            <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className={inputClass} />
          </div>
          
          {user.role === UserRole.Lawyer && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">التخصص</label>
                <select name="specialty" value={formData.specialty} onChange={handleChange} className={`${inputClass} bg-white`}>
                  {Object.values(LawyerSpecialty).map(spec => <option key={spec} value={spec}>{spec}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">القضايا الرابحة</label>
                <input type="number" name="wonCases" value={formData.wonCases || 0} onChange={handleChange} className={inputClass} />
              </div>
            </>
          )}

        </main>
        <footer className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <button onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">إلغاء</button>
          <button onClick={handleSave} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">حفظ التغييرات</button>
        </footer>
      </div>
    </div>
  );
};
