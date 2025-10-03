import React from 'react';
import { Post, User, Lawyer, Comment as CommentType, UserRole, Chat } from '../../types';
import { PostCard } from '../common/PostCard';
import { StarIcon, BriefcaseIcon, UserIcon } from '../ui/icons';

interface LawyerDashboardProps {
  currentUser: Lawyer;
  posts: Post[];
  chats: Chat[];
  users: User[];
  onCommentSubmit: (postId: number, comment: CommentType) => void;
  onChatIconClick: (chatId: string) => void;
}

export const LawyerDashboard: React.FC<LawyerDashboardProps> = ({ currentUser, posts, chats, users, onCommentSubmit, onChatIconClick }) => {
  
  const onSelectLawyer = (lawyerId: number) => {};
  const lawyerChats = chats.filter(c => c.lawyerId === currentUser.id);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <main className="lg:col-span-2">
           <h1 className="text-3xl font-extrabold text-gray-800 mb-6">الاستشارات المتاحة</h1>
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} currentUser={currentUser} onCommentSubmit={onCommentSubmit} onSelectLawyer={onSelectLawyer} />
            ))
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center text-gray-600">
                <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد استشارات حاليًا</h3>
                <p>لا توجد استشارات منشورة من قبل العملاء في الوقت الحالي. يرجى التحقق مرة أخرى قريبًا.</p>
            </div>
          )}
        </main>
        
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 border-b border-slate-200 pb-4 mb-4">ملفك الشخصي</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <StarIcon className="w-6 h-6 text-yellow-400" />
                <div>
                    <span className="font-bold text-lg">{currentUser.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-700"> ({currentUser.reviews.length} مراجعات)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="w-6 h-6 text-green-600"/>
                <span className="font-bold text-lg">{currentUser.wonCases}</span>
                <span className="text-sm text-gray-700">قضية ناجحة</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 border-b border-slate-200 pb-4 mb-4">محادثاتي</h2>
             <div className="space-y-3 max-h-[40vh] overflow-y-auto -mr-2 pr-2">
              {lawyerChats.length > 0 ? (
                lawyerChats.map(chat => {
                  const client = users.find(u => u.id === chat.clientId);
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
                        <p className="font-bold text-gray-800">{client?.fullName || 'عميل غير معروف'}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage ? lastMessage.text : 'ابدأ المحادثة...'}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                 <div className="text-center text-gray-600 py-6">
                    <p>لا توجد لديك محادثات بعد.</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};