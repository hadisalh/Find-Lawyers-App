import React, { useState, useMemo } from 'react';
import { Post, User, Chat, Client, Lawyer, LawyerSpecialty, LawyerStatus, Comment } from '../../types';
import { PostCard } from '../common/PostCard';
import { EditPostModal } from './EditPostModal';
// Fix: Imported StarIcon to be used for lawyer ratings.
import { PlusIcon, UserIcon, ChatIcon, PencilIcon, TrashIcon, HomeIcon, DocumentTextIcon, UsersIcon, StarIcon } from '../ui/icons';

type ClientTab = 'my-posts' | 'all-posts' | 'lawyers' | 'chats';

const TabButton: React.FC<{icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void;}> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-slate-200'}`}>
        {icon}
        <span>{label}</span>
    </button>
);


export const ClientDashboard: React.FC<{
  currentUser: Client;
  posts: Post[];
  chats: Chat[];
  users: User[];
  onAddPost: (post: Omit<Post, 'id' | 'createdAt' | 'comments'>) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (postId: number) => void;
  onCommentSubmit: (postId: number, comment: any) => void;
  onSelectLawyer: (lawyerId: number) => void;
  onChatIconClick: (chatId: string) => void;
  onViewLawyerProfile: (lawyer: Lawyer) => void;
}> = ({
  currentUser, posts, chats, users, onAddPost, onUpdatePost, onDeletePost, onCommentSubmit, onSelectLawyer, onChatIconClick, onViewLawyerProfile
}) => {
  const [activeTab, setActiveTab] = useState<ClientTab>('my-posts');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<LawyerSpecialty | 'all'>('all');


  const clientPosts = posts.filter(p => p.clientId === currentUser.id);
  const clientChats = chats.filter(c => c.clientId === currentUser.id);
  const approvedLawyers = useMemo(() => users.filter(u => u.role === 'lawyer' && (u as Lawyer).status === LawyerStatus.Approved) as Lawyer[], [users]);

  const filteredLawyers = useMemo(() => {
      return approvedLawyers.filter(lawyer => {
          const nameMatch = lawyer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
          const specialtyMatch = specialtyFilter === 'all' || lawyer.specialty === specialtyFilter;
          return nameMatch && specialtyMatch;
      });
  }, [approvedLawyers, searchTerm, specialtyFilter]);

  const handleAddPost = (title: string, description: string) => {
    onAddPost({ clientId: currentUser.id, clientName: currentUser.fullName, title, description });
    setShowAddForm(false);
    setActiveTab('my-posts');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'my-posts':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800">استشاراتي ومنشوراتي</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                    <PlusIcon className="w-5 h-5" />
                    {showAddForm ? 'إغلاق النموذج' : 'استشارة جديدة'}
                </button>
            </div>
            {showAddForm && (
                 <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const title = formData.get('title') as string;
                        const description = formData.get('description') as string;
                        if(title && description) handleAddPost(title, description);
                    }} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">أضف استشارة جديدة</h2>
                        <input name="title" placeholder="عنوان الاستشارة" className="w-full p-3 border border-gray-300 rounded-lg" required />
                        <textarea name="description" placeholder="وصف الحالة" className="w-full p-3 border border-gray-300 rounded-lg" rows={5} required />
                        <div className="flex justify-end gap-3">
                           <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">نشر</button>
                        </div>
                    </form>
                </div>
            )}
            {clientPosts.length > 0 ? clientPosts.map(post => (
                 <div key={post.id} className="relative group">
                    <PostCard post={post} currentUser={currentUser} onCommentSubmit={onCommentSubmit} onSelectLawyer={onSelectLawyer}/>
                    <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingPost(post)} className="bg-white p-2 rounded-full shadow-md hover:bg-slate-100"><PencilIcon className="w-5 h-5 text-slate-600" /></button>
                        <button onClick={() => window.confirm('هل أنت متأكد؟') && onDeletePost(post.id)} className="bg-white p-2 rounded-full shadow-md hover:bg-slate-100"><TrashIcon className="w-5 h-5 text-red-600" /></button>
                    </div>
                </div>
            )) : !showAddForm && <p className="text-center text-gray-500 py-10">لا توجد منشورات خاصة بك.</p>}
          </>
        );
      case 'all-posts':
        return (
            <>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6">كل الاستشارات</h2>
                {posts.length > 0 ? posts.map(post => (
                    <PostCard key={post.id} post={post} currentUser={currentUser} onCommentSubmit={onCommentSubmit} onSelectLawyer={onSelectLawyer}/>
                )) : <p className="text-center text-gray-500 py-10">لا توجد استشارات منشورة حاليًا.</p>}
            </>
        );
      case 'lawyers':
        return (
            <>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6">تصفح المحامين</h2>
                <div className="bg-white p-4 rounded-lg shadow-md mb-6 sticky top-20 z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="ابحث عن محامي بالاسم..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg"/>
                        <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value as any)} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                            <option value="all">كل التخصصات</option>
                            {Object.values(LawyerSpecialty).map(spec => <option key={spec} value={spec}>{spec}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLawyers.map(lawyer => (
                        <div key={lawyer.id} className="bg-white p-5 rounded-xl shadow-lg border text-center flex flex-col">
                            <div className="bg-slate-100 p-3 rounded-full w-20 h-20 mx-auto -mt-12 border-4 border-white flex items-center justify-center">
                                <UserIcon className="w-12 h-12 text-slate-500"/>
                            </div>
                            <h3 className="font-bold text-xl mt-4 text-gray-800">{lawyer.fullName}</h3>
                            <p className="text-blue-600 font-semibold my-1">{lawyer.specialty}</p>
                            <div className="flex justify-center items-center gap-1 my-2 text-yellow-500">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5" filled={i < lawyer.rating} />)}
                                <span className="text-gray-600 font-bold ml-1">({lawyer.rating})</span>
                            </div>
                            <div className="mt-auto pt-4 flex gap-2">
                                <button onClick={() => onViewLawyerProfile(lawyer)} className="w-full bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-lg hover:bg-slate-300 transition">عرض الملف</button>
                                <button onClick={() => onSelectLawyer(lawyer.id)} className="w-full bg-blue-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-blue-700 transition">محادثة</button>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
      case 'chats':
        return (
            <>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6">محادثاتي</h2>
                <div className="bg-white p-4 rounded-xl shadow-lg border">
                    {clientChats.length > 0 ? (
                        <ul className="space-y-2">
                            {clientChats.map(chat => {
                                const lawyer = users.find(u => u.id === chat.lawyerId);
                                if (!lawyer) return null;
                                return (
                                    <li key={chat.id} className="p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-3" onClick={() => onChatIconClick(chat.id)}>
                                        <div className="bg-slate-200 p-2 rounded-full"><UserIcon className="w-6 h-6 text-slate-600"/></div>
                                        <div>
                                            <p className="font-bold text-gray-800">{lawyer.fullName}</p>
                                            <p className="text-sm text-gray-600">اضغط لعرض المحادثة</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : <p className="text-center text-gray-500 py-10">لا توجد لديك محادثات.</p>}
                </div>
            </>
        );
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-2 mb-8 flex flex-wrap justify-center gap-2">
            <TabButton icon={<HomeIcon className="w-5 h-5"/>} label="استشاراتي" isActive={activeTab === 'my-posts'} onClick={() => setActiveTab('my-posts')} />
            <TabButton icon={<DocumentTextIcon className="w-5 h-5"/>} label="كل الاستشارات" isActive={activeTab === 'all-posts'} onClick={() => setActiveTab('all-posts')} />
            <TabButton icon={<UsersIcon className="w-5 h-5"/>} label="تصفح المحامين" isActive={activeTab === 'lawyers'} onClick={() => setActiveTab('lawyers')} />
            <TabButton icon={<ChatIcon className="w-5 h-5"/>} label="محادثاتي" isActive={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
       </div>
       <div>
            {renderContent()}
       </div>
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSave={(updatedPost) => { onUpdatePost(updatedPost); setEditingPost(null); }}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
};
