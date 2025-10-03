import React, { useState } from 'react';
import { Post, User, Chat, Client, Lawyer, UserRole, LawyerStatus } from '../../types';
import { PostCard } from '../common/PostCard';
import { PlusIcon, UserIcon, BriefcaseIcon } from '../ui/icons';

interface ClientDashboardProps {
  currentUser: Client;
  posts: Post[];
  users: User[];
  chats: Chat[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  onStartChat: (lawyerId: number) => void;
  onChatIconClick: (chatId: string) => void;
  onViewProfile: (lawyerId: number) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ currentUser, posts, users, chats, setPosts, onStartChat, onChatIconClick, onViewProfile }) => {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostDescription) return;

    const newPost: Post = {
      id: Date.now(),
      clientId: currentUser.id,
      clientName: currentUser.fullName,
      title: newPostTitle,
      description: newPostDescription,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setNewPostTitle('');
    setNewPostDescription('');
  };

  const handleCommentSubmit = () => {
    // Clients do not submit comments, this is for the PostCard prop.
  };

  const clientChats = chats.filter(c => c.clientId === currentUser.id);
  const lawyers = users.filter(u => u.role === UserRole.Lawyer && (u as Lawyer).status === LawyerStatus.Approved) as Lawyer[];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <main className="lg:col-span-2">
           <h1 className="text-3xl font-extrabold text-gray-800 mb-6">ساحة الاستشارات العامة</h1>
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUser={currentUser} 
                onCommentSubmit={handleCommentSubmit} 
                onSelectLawyer={onStartChat} 
              />
            ))
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center text-gray-600">
                <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد استشارات منشورة</h3>
                <p>كن أول من يطلب استشارة قانونية!</p>
            </div>
          )}
        </main>
        
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-24 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 border-b border-slate-200 pb-4 mb-4 flex items-center gap-2">
                <PlusIcon className="w-6 h-6"/>
                اطلب استشارة جديدة
              </h2>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  placeholder="عنوان الاستشارة (مثال: مشكلة في عقد إيجار)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <textarea
                  value={newPostDescription}
                  onChange={e => setNewPostDescription(e.target.value)}
                  placeholder="اشرح مشكلتك بالتفصيل هنا..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  rows={5}
                  required
                ></textarea>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                  نشر الاستشارة
                </button>
              </form>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 border-b border-slate-200 pb-4 mb-4">محادثاتي</h2>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto -mr-2 pr-2">
                {clientChats.length > 0 ? (
                  clientChats.map(chat => {
                    const lawyer = lawyers.find(l => l.id === chat.lawyerId);
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    return (
                      <button 
                        key={chat.id} 
                        onClick={() => onChatIconClick(chat.id)}
                        className="w-full text-right p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors flex items-start gap-3 border border-slate-200"
                      >
                        <div className="bg-slate-200 p-2 rounded-full">
                          <UserIcon className="w-6 h-6 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800">{lawyer?.fullName || 'محامي غير معروف'}</p>
                          <p className="text-sm text-gray-600 truncate">
                            {lastMessage ? (lastMessage.senderId === currentUser.id ? 'أنت: ' : '') + lastMessage.text : 'ابدأ المحادثة...'}
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                   <div className="text-center text-gray-600 py-6">
                      <p>لم تبدأ أي محادثات بعد.</p>
                      <p className="text-sm">عندما تختار عرض محامي، ستظهر محادثتك هنا.</p>
                  </div>
                )}
              </div>
            </div>

             <div>
                <h2 className="text-2xl font-bold text-gray-800 border-b border-slate-200 pb-4 mb-4">تصفح المحامين</h2>
                <div className="space-y-3 max-h-[30vh] overflow-y-auto -mr-2 pr-2">
                    {lawyers.map(lawyer => (
                        <button
                            key={lawyer.id}
                            onClick={() => onViewProfile(lawyer.id)}
                            className="w-full text-right p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors flex items-start gap-3 border border-slate-200"
                        >
                            <div className="bg-slate-200 p-2 rounded-full">
                                <BriefcaseIcon className="w-6 h-6 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800">{lawyer.fullName}</p>
                                <p className="text-sm text-gray-600">{lawyer.specialty}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
};
