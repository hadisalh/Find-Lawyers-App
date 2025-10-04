import React, { useState } from 'react';
import { Post, Comment, User, Chat, Lawyer } from '../../types';
import { PostCard } from '../common/PostCard';
import { DashboardLayout } from './DashboardLayout';
import { UserIcon, BriefcaseIcon, StarIcon, ChatIcon, DocumentTextIcon, ScaleIcon, ArrowLeftOnRectangleIcon } from '../ui/icons';

interface LawyerDashboardProps {
  currentUser: Lawyer;
  posts: Post[];
  chats: Chat[];
  users: User[];
  onCommentSubmit: (postId: number, comment: Comment) => void;
  onChatIconClick: (chatId: string) => void;
  onLogout: () => void;
}

type LawyerView = 'posts' | 'chats';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg">
    <div className={`text-white p-4 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
    </div>
  </div>
);

const SidebarLink: React.FC<{icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void;}> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center w-full text-right gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
        {icon}
        <span>{label}</span>
    </button>
);


export const LawyerDashboard: React.FC<LawyerDashboardProps> = ({
  currentUser,
  posts,
  chats,
  users,
  onCommentSubmit,
  onChatIconClick,
  onLogout
}) => {
  const [activeView, setActiveView] = useState<LawyerView>('posts');
  const lawyerChats = chats.filter(c => c.lawyerId === currentUser.id);

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 mb-10 px-2 hidden md:flex">
        <ScaleIcon className="w-10 h-10" />
        <h1 className="text-xl font-bold text-white">محامي العراق</h1>
      </div>
      <nav className="flex-grow space-y-2">
        <SidebarLink icon={<DocumentTextIcon className="w-5 h-5"/>} label="الاستشارات" isActive={activeView === 'posts'} onClick={() => setActiveView('posts')} />
        <SidebarLink icon={<ChatIcon className="w-5 h-5"/>} label="محادثاتي" isActive={activeView === 'chats'} onClick={() => setActiveView('chats')} />
      </nav>
      <div className="mt-auto">
        <div className="border-t border-slate-700 py-4 px-2">
          <p className="text-sm text-slate-300">أهلاً بك،</p>
          <p className="font-bold text-white">{currentUser.fullName}</p>
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
      case 'posts':
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6">استشارات العملاء المتاحة</h2>
            {posts.length > 0 ? (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onCommentSubmit={onCommentSubmit}
                  onSelectLawyer={() => {}} // Lawyers don't select other lawyers
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md border">
                  <p className="text-slate-600 text-lg">لا توجد استشارات منشورة حاليًا.</p>
              </div>
            )}
          </>
        );
      case 'chats':
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6">محادثاتي</h2>
            <div className="bg-white p-4 rounded-xl shadow-lg border">
                {lawyerChats.length > 0 ? (
                  <ul className="divide-y divide-slate-200">
                    {lawyerChats.map(chat => {
                      const client = users.find(u => u.id === chat.clientId);
                      if (!client) return null;
                      const lastMessage = chat.messages[chat.messages.length - 1];
                      return (
                        <li key={chat.id} className="p-4 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-4" onClick={() => onChatIconClick(chat.id)}>
                          <div className="bg-slate-200 p-3 rounded-full">
                            <UserIcon className="w-7 h-7 text-slate-600"/>
                          </div>
                          <div className="flex-grow">
                              <p className="font-bold text-lg text-slate-800">{client.fullName}</p>
                              <p className="text-md text-slate-500 truncate max-w-xs sm:max-w-md">
                                {lastMessage ? `${lastMessage.senderId === currentUser.id ? 'أنت: ' : ''}${lastMessage.text}` : 'ابدأ المحادثة...'}
                              </p>
                          </div>
                           <div className="text-xs text-slate-500 ml-auto whitespace-nowrap">
                              {lastMessage && new Date(lastMessage.timestamp).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit'})}
                           </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-center text-slate-500 py-10">
                    لا توجد محادثات. قدم عرضًا على استشارة لبدء محادثة.
                  </p>
                )}
            </div>
          </>
        );
    }
  }

  return (
    <DashboardLayout sidebar={sidebarContent}>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">أهلاً بعودتك، {currentUser.fullName}</h1>
        <p className="text-md text-slate-500">هنا ملخص نشاطك وأحدث الاستشارات المتاحة.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard icon={<BriefcaseIcon className="w-6 h-6"/>} label="القضايا الرابحة" value={currentUser.wonCases} color="bg-blue-500" />
        <StatCard icon={<StarIcon className="w-6 h-6"/>} label="متوسط التقييم" value={`${currentUser.rating} / 5`} color="bg-amber-500" />
        <StatCard icon={<ChatIcon className="w-6 h-6"/>} label="محادثات نشطة" value={lawyerChats.length} color="bg-violet-500" />
        <StatCard icon={<UserIcon className="w-6 h-6"/>} label="إجمالي التقييمات" value={currentUser.numberOfRatings} color="bg-pink-500" />
      </div>

      <div>
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};