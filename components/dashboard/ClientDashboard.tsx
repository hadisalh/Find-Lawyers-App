import React, { useState, useMemo } from 'react';
import { Post, User, Chat, Client, Lawyer, LawyerSpecialty, LawyerStatus, Comment } from '../../types';
import { PostCard } from '../common/PostCard';
import { EditPostModal } from './EditPostModal';
import { DashboardLayout } from './DashboardLayout';
import { PlusIcon, UserIcon, ChatIcon, PencilIcon, TrashIcon, HomeIcon, DocumentTextIcon, UsersIcon, StarIcon, MagnifyingGlassIcon, ScaleIcon, ArrowLeftOnRectangleIcon } from '../ui/icons';
import { ThemeToggle } from '../common/ThemeToggle';

type ClientView = 'my-posts' | 'all-posts' | 'lawyers' | 'chats';

const SidebarLink: React.FC<{icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void;}> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center w-full text-right gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
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
  onLogout: () => void;
}> = ({
  currentUser, posts, chats, users, onAddPost, onUpdatePost, onDeletePost, onCommentSubmit, onSelectLawyer, onChatIconClick, onViewLawyerProfile, onLogout
}) => {
  const [activeView, setActiveView] = useState<ClientView>('my-posts');
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
    setActiveView('my-posts');
  };
  
  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 mb-10 px-2 hidden md:flex">
        <ScaleIcon className="w-8 h-8 text-emerald-500" />
        <h1 className="text-xl font-bold text-white">محامي العراق</h1>
      </div>
      <nav className="flex-grow space-y-2">
        <SidebarLink icon={<HomeIcon className="w-5 h-5"/>} label="استشاراتي" isActive={activeView === 'my-posts'} onClick={() => setActiveView('my-posts')} />
        <SidebarLink icon={<DocumentTextIcon className="w-5 h-5"/>} label="كل الاستشارات" isActive={activeView === 'all-posts'} onClick={() => setActiveView('all-posts')} />
        <SidebarLink icon={<UsersIcon className="w-5 h-5"/>} label="تصفح المحامين" isActive={activeView === 'lawyers'} onClick={() => setActiveView('lawyers')} />
        <SidebarLink icon={<ChatIcon className="w-5 h-5"/>} label="محادثاتي" isActive={activeView === 'chats'} onClick={() => setActiveView('chats')} />
      </nav>
      <div className="mt-auto">
        <div className="border-t border-slate-700 py-4 px-2">
          <p className="text-sm text-slate-300">أهلاً بك،</p>
          <p className="font-bold text-white mb-4">{currentUser.fullName}</p>
          <ThemeToggle />
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </>
  );


  const renderContent = () => {
    switch(activeView) {
      case 'my-posts':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">استشاراتي ومنشوراتي</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-emerald-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 shadow-lg">
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">{showAddForm ? 'إغلاق' : 'استشارة جديدة'}</span>
                </button>
            </div>
            {showAddForm && (
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const title = formData.get('title') as string;
                        const description = formData.get('description') as string;
                        if(title && description) handleAddPost(title, description);
                    }} className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">أضف استشارة جديدة</h2>
                        <input name="title" placeholder="عنوان الاستشارة" className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-lg" required />
                        <textarea name="description" placeholder="وصف الحالة" className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-lg" rows={5} required />
                        <div className="flex justify-end gap-3">
                           <button type="submit" className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-600">نشر</button>
                        </div>
                    </form>
                </div>
            )}
            {clientPosts.length > 0 ? clientPosts.map(post => (
                 <div key={post.id} className="relative group">
                    <PostCard post={post} currentUser={currentUser} onCommentSubmit={onCommentSubmit} onSelectLawyer={onSelectLawyer}/>
                    <div className="absolute top-6 left-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingPost(post)} className="bg-white dark:bg-slate-600 p-2 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-500"><PencilIcon className="w-5 h-5 text-slate-600 dark:text-slate-200" /></button>
                        <button onClick={() => window.confirm('هل أنت متأكد؟') && onDeletePost(post.id)} className="bg-white dark:bg-slate-600 p-2 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-500"><TrashIcon className="w-5 h-5 text-red-600" /></button>
                    </div>
                </div>
            )) : !showAddForm && <p className="text-center text-slate-500 dark:text-slate-400 py-10">لا توجد منشورات خاصة بك. أضف واحدة الآن!</p>}
          </>
        );
      case 'all-posts':
        return (
            <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">كل الاستشارات</h2>
                {posts.length > 0 ? posts.map(post => (
                    <PostCard key={post.id} post={post} currentUser={currentUser} onCommentSubmit={onCommentSubmit} onSelectLawyer={onSelectLawyer}/>
                )) : <p className="text-center text-slate-500 dark:text-slate-400 py-10">لا توجد استشارات منشورة حاليًا.</p>}
            </>
        );
      case 'lawyers':
        return (
            <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">تصفح المحامين</h2>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md mb-6 sticky top-0 md:top-4 z-10 border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                <MagnifyingGlassIcon className="w-5 h-5" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="ابحث عن محامي بالاسم..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="w-full p-3 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                            />
                        </div>
                        <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value as any)} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
                            <option value="all">كل التخصصات</option>
                            {Object.values(LawyerSpecialty).map(spec => <option key={spec} value={spec}>{spec}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {filteredLawyers.length > 0 ? (
                        filteredLawyers.map(lawyer => (
                            <div key={lawyer.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border dark:border-slate-700 text-center flex flex-col transition-transform hover:-translate-y-2 hover:shadow-xl">
                                <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full w-24 h-24 mx-auto -mt-16 border-4 border-white dark:border-slate-800 flex items-center justify-center">
                                    <UserIcon className="w-12 h-12 text-slate-500 dark:text-slate-400"/>
                                </div>
                                <h3 className="font-bold text-xl mt-4 text-slate-800 dark:text-slate-200">{lawyer.fullName}</h3>
                                <p className="text-emerald-600 dark:text-emerald-500 font-semibold my-1">{lawyer.specialty}</p>
                                <div className="flex justify-center items-center gap-1 my-2 text-yellow-400">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5" filled={i < lawyer.rating} />)}
                                    <span className="text-slate-600 dark:text-slate-400 font-bold ml-1">({lawyer.rating})</span>
                                </div>
                                <div className="mt-auto pt-4 flex gap-3">
                                    <button onClick={() => onViewLawyerProfile(lawyer)} className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition">عرض الملف</button>
                                    <button onClick={() => onSelectLawyer(lawyer.id)} className="w-full bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-emerald-600 transition">محادثة</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md border dark:border-slate-700">
                            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-slate-400" />
                            <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">لم يتم العثور على محامين</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">جرّب تعديل مصطلحات البحث أو تغيير الفلتر.</p>
                        </div>
                    )}
                </div>
            </>
        );
      case 'chats':
        return (
            <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">محادثاتي</h2>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border dark:border-slate-700">
                    {clientChats.length > 0 ? (
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                            {clientChats.map(chat => {
                                const lawyer = users.find(u => u.id === chat.lawyerId);
                                if (!lawyer) return null;
                                return (
                                    <li key={chat.id} className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-4" onClick={() => onChatIconClick(chat.id)}>
                                        <div className="bg-slate-200 dark:bg-slate-600 p-3 rounded-full"><UserIcon className="w-6 h-6 text-slate-600 dark:text-slate-300"/></div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{lawyer.fullName}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">اضغط لعرض المحادثة</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : <p className="text-center text-slate-500 dark:text-slate-400 py-10">لا توجد لديك محادثات.</p>}
                </div>
            </>
        );
    }
  }

  return (
    <>
      <DashboardLayout sidebar={sidebarContent}>
        {renderContent()}
      </DashboardLayout>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSave={(updatedPost) => { onUpdatePost(updatedPost); setEditingPost(null); }}
          onClose={() => setEditingPost(null)}
        />
      )}
    </>
  );
};