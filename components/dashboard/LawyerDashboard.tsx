import React from 'react';
import { Post, Comment, User, Chat, Lawyer } from '../../types';
import { PostCard } from '../common/PostCard';
import { UserIcon } from '../ui/icons';

interface LawyerDashboardProps {
  currentUser: Lawyer;
  posts: Post[];
  chats: Chat[];
  users: User[];
  onCommentSubmit: (postId: number, comment: Comment) => void;
  onChatIconClick: (chatId: string) => void;
}

export const LawyerDashboard: React.FC<LawyerDashboardProps> = ({
  currentUser,
  posts,
  chats,
  users,
  onCommentSubmit,
  onChatIconClick,
}) => {
  const lawyerChats = chats.filter(c => c.lawyerId === currentUser.id);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <main className="lg:col-span-2">
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
        </main>

        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">محادثاتي</h2>
            {lawyerChats.length > 0 ? (
              <ul className="space-y-3">
                {lawyerChats.map(chat => {
                  const client = users.find(u => u.id === chat.clientId);
                  if (!client) return null;
                   const lastMessage = chat.messages[chat.messages.length - 1];
                  return (
                    <li key={chat.id} className="p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => onChatIconClick(chat.id)}>
                      <div className="flex items-center gap-3">
                         <div className="bg-slate-200 p-2 rounded-full">
                           <UserIcon className="w-6 h-6 text-slate-600"/>
                         </div>
                         <div>
                            <p className="font-bold text-gray-800">{client.fullName}</p>
                            <p className="text-sm text-gray-600 truncate max-w-[200px]">
                               {lastMessage ? lastMessage.text : 'ابدأ المحادثة...'}
                            </p>
                         </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center text-gray-600 py-4">
                لا توجد محادثات. قدم عرضًا على استشارة لبدء محادثة.
              </p>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};
