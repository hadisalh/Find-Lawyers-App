import React, { useState } from 'react';
import { Post, Comment as CommentType, User, UserRole, Lawyer, LawyerSpecialty } from '../../types';
import { UserIcon, ChatIcon } from '../ui/icons';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onCommentSubmit: (postId: number, comment: CommentType) => void;
  onSelectLawyer: (lawyerId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onCommentSubmit, onSelectLawyer }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [cost, setCost] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !cost || currentUser.role !== UserRole.Lawyer) return;

    const lawyerUser = currentUser as Lawyer;
    const comment: CommentType = {
      id: Date.now(),
      lawyerId: currentUser.id,
      lawyerName: currentUser.fullName,
      lawyerSpecialty: lawyerUser.specialty,
      text: newComment,
      cost: cost,
    };
    onCommentSubmit(post.id, comment);
    setNewComment('');
    setCost('');
  };

  const isClientOwner = currentUser.role === UserRole.Client && currentUser.id === post.clientId;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-8 transition-shadow hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-slate-100 p-2 rounded-full mr-4">
            <UserIcon className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <p className="font-bold text-lg text-gray-800">{post.clientName}</p>
            <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{post.title}</h3>
        <p className="text-gray-700 leading-relaxed text-md">{post.description}</p>
      </div>

      <div className="bg-slate-50 px-6 py-3 border-t border-b border-slate-200">
        <button onClick={() => setShowComments(!showComments)} className="text-blue-600 font-bold text-md hover:text-blue-800 transition-colors">
          {showComments ? 'إخفاء العروض' : `عرض العروض (${post.comments.length})`}
        </button>
      </div>

      {showComments && (
        <div className="p-6 bg-slate-50">
          <h4 className="font-bold text-lg mb-4 text-gray-700">عروض المحامين</h4>
          {post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <p className="font-bold text-lg text-blue-700">{comment.lawyerName}</p>
                      <p className="text-sm text-gray-600 mb-2">{comment.lawyerSpecialty}</p>
                      <p className="text-gray-800 my-1">{comment.text}</p>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:text-left">
                      <p className="text-md font-extrabold text-green-600 whitespace-nowrap">{comment.cost}</p>
                      {isClientOwner && (
                        <button 
                          onClick={() => onSelectLawyer(comment.lawyerId)}
                          className="mt-2 w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
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
            <p className="text-gray-600 text-center py-4">لا توجد عروض بعد. كن أول من يقدم عرضًا!</p>
          )}

          {currentUser.role === UserRole.Lawyer && (
            <form onSubmit={handleCommentSubmit} className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
              <h5 className="font-bold text-lg mb-3">إضافة عرض سعر</h5>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="اشرح كيف يمكنك المساعدة..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 transition"
                rows={3}
              ></textarea>
              <input
                type="text"
                value={cost}
                onChange={e => setCost(e.target.value)}
                placeholder="التكاليف المقترحة (مثال: 150,000 دينار عراقي)"
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 transition"
              />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                إرسال العرض
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};