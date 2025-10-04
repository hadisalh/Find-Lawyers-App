import React, { useState } from 'react';
import { Post, Comment, User, Chat, Lawyer } from '../../types';
import { PostCard } from '../common/PostCard';
import { UserIcon, BriefcaseIcon, StarIcon, UsersIcon, ChatIcon, DocumentTextIcon } from '../ui/icons';

interface LawyerDashboardProps {
  currentUser: Lawyer;
  posts: Post[];
  chats: Chat[];
  users: User[];
  onCommentSubmit: (postId: number, comment: Comment) => void;
  onChatIconClick: (chatId: string) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 flex items-center gap-4 transition-transform hover:scale-105 hover:shadow-lg">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-2xl font-extrabold text-gray-800">{value}</p>
    </div>
  </div>
);

const TabButton: React.FC<{icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void;}> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-slate-200'}`}>
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
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'chats'>('posts');
  const lawyerChats = chats.filter(c => c.lawyerId === currentUser.id);

  const renderContent = () => {
    switch(activeTab) {
      case 'posts':
        return (
          <>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">استشارات العملاء المتاحة</h2>
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
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <p className="text-gray-600 text-lg">لا توجد استشارات منشورة حاليًا.</p>
              </div>
            )}
          </>
        );
      case 'chats':
        return (
          <>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">محادثاتي</h2>
            <div className="bg-white p-4 rounded-xl shadow-lg border">
                {lawyerChats.length > 0 ? (
                  <ul className="space-y-2">
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
                              <p className="font-bold text-lg text-gray-800">{client.fullName}</p>
                              <p className="text-md text-gray-600 truncate max-w-xs sm:max-w-md">
                                {lastMessage ? `${lastMessage.senderId === currentUser.id ? 'أنت: ' : ''}${lastMessage.text}` : 'ابدأ المحادثة...'}
                              </p>
                          </div>
                           <div className="text-xs text-gray-500 ml-auto whitespace-nowrap">
                              {lastMessage && new Date(lastMessage.timestamp).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit'})}
                           </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-center text-gray-600 py-10">
                    لا توجد محادثات. قدم عرضًا على استشارة لبدء محادثة.
                  </p>
                )}
            </div>
          </>
        );
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">أهلاً بعودتك، {currentUser.fullName}</h1>
        <p className="text-md text-gray-600">هنا ملخص نشاطك وأحدث الاستشارات المتاحة.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<BriefcaseIcon className="w-6 h-6"/>} label="القضايا الرابحة" value={currentUser.wonCases} />
        <StatCard icon={<StarIcon className="w-6 h-6"/>} label="متوسط التقييم" value={`${currentUser.rating} / 5`} />
        <StatCard icon={<UsersIcon className="w-6 h-6"/>} label="إجمالي التقييمات" value={currentUser.numberOfRatings} />
        <StatCard icon={<ChatIcon className="w-6 h-6"/>} label="محادثات نشطة" value={lawyerChats.length} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-2 mb-8 flex flex-wrap justify-center gap-2 sticky top-20 z-20">
        <TabButton icon={<DocumentTextIcon className="w-5 h-5"/>} label="الاستشارات المتاحة" isActive={activeTab === 'posts'} onClick={() => setActiveTab('posts')} />
        <TabButton icon={<ChatIcon className="w-5 h-5"/>} label="محادثاتي" isActive={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
      </div>

      {/* Tab Content */}
      <div>
        {renderContent()}
      </div>

    </div>
  );
};