import React, { useState, useEffect } from 'react';
import { Admin } from '../../types';

interface EditAdminModalProps {
  admin: Admin;
  onSave: (updatedAdmin: Admin) => void;
  onClose: () => void;
}

export const EditAdminModal: React.FC<EditAdminModalProps> = ({ admin, onSave, onClose }) => {
  const [fullName, setFullName] = useState(admin.fullName);
  const [email, setEmail] = useState(admin.email);
  const [phone, setPhone] = useState(admin.phone);
  const [password, setPassword] = useState(admin.password || '');

  useEffect(() => {
    setFullName(admin.fullName);
    setEmail(admin.email);
    setPhone(admin.phone);
    setPassword(admin.password || '');
  }, [admin]);

  const handleSave = () => {
    onSave({ ...admin, fullName, email, phone, password });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">تعديل بيانات المشرف</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light" aria-label="Close">&times;</button>
        </header>
        <main className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">رقم الهاتف</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
          </div>
        </main>
        <footer className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <button onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">
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
