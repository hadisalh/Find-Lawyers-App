import React, { useState } from 'react';
import { Post, Comment as CommentType, User, UserRole, Lawyer, LawyerSpecialty } from '../../types';
import { UserIcon, ChatIcon, FlagIcon } from '../ui/icons';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onCommentSubmit: (postId: number, comment: CommentType) => void;
  onSelectLawyer: (lawyerId: number) => void;
  onReport: (type: 'post' | 'user', id: number, name: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onCommentSubmit, onSelectLawyer, onReport }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [cost, setCost] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || (currentUser.role === UserRole.Lawyer && !cost)) return;

    const userRole = currentUser.role;
    const lawyerUser = currentUser as Lawyer;
    
    const comment: CommentType = {
      id: Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: userRole,
      authorSpecialty: userRole === UserRole.Lawyer ? lawyerUser.specialty : undefined,
      text: newComment,
      cost: userRole === UserRole.Lawyer ? cost : undefined,
    };
    onCommentSubmit(post.id, comment);
    setNewComment('');
    setCost('');
  };

  const isAuthor = currentUser.id === post.authorId;
  const canComment = currentUser.role === UserRole.Lawyer || currentUser.role === UserRole.Admin;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden mb-6 transition-shadow hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full mr-4">
            <UserIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="flex-grow">
             <div className="flex items-center gap-2">
                <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{post.authorName}</p>
                 {post.authorRole === UserRole.Client && !isAuthor && currentUser.role === UserRole.Lawyer && (
                    <button 
                        onClick={() => onReport('user', post.authorId, post.authorName)}
                        className="text-slate-400 hover:text-red-500"
                        title={`الإبلاغ عن المستخدم ${post.authorName}`}>
                        <FlagIcon className="w-4 h-4"/>
                    </button>
                )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(post.createdAt).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
           {!isAuthor && (
             <button 
                onClick={() => onReport('post', post.id, post.title)}
                className="text-slate-400 hover:text-red-500 flex-shrink-0"
                title="الإبلاغ عن المنشور">
                <FlagIcon className="w-5 h-5"/>
            </button>
        )}
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">{post.title}</h3>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{post.description}</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-t border-slate-200 dark:border-slate-700">
        <button onClick={() => setShowComments(!showComments)} className="text-emerald-600 dark:text-emerald-500 font-bold hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">
          {showComments ? 'إخفاء العروض والتعليقات' : `عرض العروض والتعليقات (${post.comments.length})`}
        </button>
      </div>

      {showComments && (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-lg mb-4 text-slate-700 dark:text-slate-300">العروض والتعليقات</h4>
          {post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-md text-slate-800 dark:text-slate-200">{comment.authorName}</p>
                       {comment.authorRole === UserRole.Lawyer && comment.authorSpecialty && (
                        <p className="text-sm text-emerald-700 dark:text-emerald-500 font-semibold mb-2">{comment.authorSpecialty}</p>
                      )}
                      {comment.authorRole === UserRole.Admin && (
                         <p className="text-sm text-blue-700 dark:text-blue-500 font-semibold mb-2">تعليق من الإدارة</p>
                      )}
                      <p className="text-slate-600 dark:text-slate-300 my-1">{comment.text}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:text-left">
                      {comment.cost && <p className="text-md font-extrabold text-slate-800 dark:text-slate-100">{comment.cost}</p>}
                      {post.authorRole === UserRole.Client && isAuthor && comment.authorRole === UserRole.Lawyer && (
                        <button 
                          onClick={() => onSelectLawyer(comment.authorId)}
                          className="mt-2 w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-transform transform hover:scale-105">
                          <ChatIcon className="w-4 h-4" />
                          اختيار وبدء محادثة
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">لا توجد عروض أو تعليقات بعد.</p>
          )}

          {canComment && !isAuthor && (
            <form onSubmit={handleCommentSubmit} className="mt-6 p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
              <h5 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-200">
                {currentUser.role === UserRole.Lawyer ? 'إضافة عرض سعر' : 'إضافة تعليق'}
              </h5>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="اشرح كيف يمكنك المساعدة..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-600 dark:text-slate-200 border-slate-300 dark:border-slate-500 rounded-lg mb-2 focus:ring-2 focus:ring-emerald-500 transition"
                rows={3}
              ></textarea>
              {currentUser.role === UserRole.Lawyer && (
                <input
                  type="text"
                  value={cost}
                  onChange={e => setCost(e.target.value)}
                  placeholder="التكاليف المقترحة (مثال: 150,000 دينار عراقي)"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-600 dark:text-slate-200 border-slate-300 dark:border-slate-500 rounded-lg mb-3 focus:ring-2 focus:ring-emerald-500 transition"
                />
              )}
              <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3 px-5 rounded-lg hover:bg-emerald-600 transition-transform transform hover:scale-105">
                 {currentUser.role === UserRole.Lawyer ? 'إرسال العرض' : 'إرسال التعليق'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};