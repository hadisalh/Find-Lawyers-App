import React, { useState } from 'react';
import { Post, User, Lawyer, Comment as CommentType, Chat, LawyerSpecialty } from '../../types';
import { PostCard } from '../common/PostCard';
import { ChatIcon, StarIcon, PlusIcon } from '../ui/icons';

interface ClientDashboardProps {
  currentUser: User;
  posts: Post[];
  users: User[];
  chats: Chat[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  onStartChat: (lawyerId: number) => void;
  onChatIconClick: (chatId: string) => void;
  onViewProfile: (lawyerId: number) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ currentUser, posts, users, chats, setPosts, onStartChat, onChatIconClick, onViewProfile }) => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDesc, setNewPostDesc] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  const lawyers = users.filter(u => u.role === 'lawyer' && (u as Lawyer).status === 'approved') as Lawyer[];
  const clientPosts = posts.filter(p => p.clientId === currentUser.id);
  const clientChats = chats.filter(c => c.clientId === currentUser.id);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostDesc) return;
    const newPost: Post = {
      id: Date.now(),
      clientId: currentUser.id,
      clientName: currentUser.fullName,
      title: newPostTitle,
      description: newPostDesc,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setNewPostTitle('');
    setNewPostDesc('');
    setShowPostForm(false);
  };
  
  const handleCommentSubmit = (postId: number, comment: CommentType) => {};

  const filteredLawyers = lawyers.filter(lawyer => {
    const nameMatch = lawyer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const specialtyMatch = selectedSpecialty ? lawyer.specialty === selectedSpecialty : true;
    const ratingMatch = selectedRating > 0 ? lawyer.rating >= selectedRating : true;
    return nameMatch && specialtyMatch && ratingMatch;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">استشاراتي القانونية</h1>
            <button onClick={() => setShowPostForm(!showPostForm)} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg hover:shadow-blue-500/50">
              <PlusIcon className="w-5 h-5" />
              {showPostForm ? 'إلغاء' : 'إضافة استشارة جديدة'}
            </button>
          </div>

          {showPostForm && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8">
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label htmlFor="postTitle" className="block text-gray-700 font-bold mb-2">عنوان الاستشارة</label>
                  <input type="text" id="postTitle" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" placeholder="مثال: استشارة بخصوص عقد إيجار" />
                </div>
                <div>
                  <label htmlFor="postDesc" className="block text-gray-700 font-bold mb-2">التفاصيل</label>
                  <textarea id="postDesc" rows={5} value={newPostDesc} onChange={(e) => setNewPostDesc(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" placeholder="اشرح قضيتك أو استفسارك بالتفصيل هنا..."></textarea>
                </div>
                <button type="submit" className="w-full sm:w-auto bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105">نشر</button>
              </form>
            </div>
          )}
          
          {clientPosts.length > 0 ? (
            clientPosts.map(post => (
              <PostCard key={post.id} post={post} currentUser={currentUser} onCommentSubmit={handleCommentSubmit} onSelectLawyer={onStartChat} />
            ))
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center text-gray-500">
                <h3 className="text-xl font-bold text-gray-700 mb-2">لم تبدأ بعد!</h3>
                <p>لم تقم بنشر أي استشارة. اضغط على "إضافة استشارة جديدة" لبدء الحصول على عروض من المحامين.</p>
            </div>
          )}
        </main>
        
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-5">ابحث عن محامي</h3>
            <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
              <input type="text" placeholder="البحث بالاسم..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                <option value="">كل التخصصات</option>
                {Object.values(LawyerSpecialty).map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
               <select value={selectedRating} onChange={e => setSelectedRating(Number(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                <option value="0">أي تقييم</option>
                <option value="4.5">4.5+ نجوم</option>
                <option value="4">4+ نجوم</option>
                <option value="3">3+ نجوم</option>
              </select>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">قائمة المحامين ({filteredLawyers.length})</h3>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto -mr-2 pr-2">
              {filteredLawyers.length > 0 ? (
                filteredLawyers.map(lawyer => (
                  <div key={lawyer.id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 truncate">{lawyer.fullName}</p>
                        <p className="text-sm text-gray-600 truncate">{lawyer.specialty}</p>
                        <div className="flex items-center mt-1">
                          <StarIcon className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-700 mr-1 font-semibold">{lawyer.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 flex-shrink-0">
                         <button onClick={() => onStartChat(lawyer.id)} className="bg-blue-100 text-blue-800 text-xs font-bold py-1 px-3 rounded-full hover:bg-blue-200 transition-colors">مراسلة</button>
                        <button onClick={() => onViewProfile(lawyer.id)} className="bg-slate-200 text-slate-800 text-xs font-bold py-1 px-3 rounded-full hover:bg-slate-300 transition-colors">ملف</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                 <div className="text-center text-gray-500 py-6">
                    <p>لا يوجد محامون يطابقون بحثك.</p>
                </div>
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
