import React, { useState, useEffect } from 'react';
import { Post } from '../../types';

interface EditPostModalProps {
  post: Post;
  onSave: (updatedPost: Post) => void;
  onClose: () => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({ post, onSave, onClose }) => {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);

  useEffect(() => {
    setTitle(post.title);
    setDescription(post.description);
  }, [post]);

  const handleSave = () => {
    onSave({ ...post, title, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">تعديل المنشور</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light" aria-label="Close">&times;</button>
        </header>
        <main className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">عنوان المنشور</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">الوصف</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              rows={6}
            ></textarea>
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