import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { LawyerDashboard } from './components/dashboard/LawyerDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { ChatWindow } from './components/chat/ChatWindow';
import { Disclaimer } from './components/Disclaimer';
import { User, Post, Chat, Comment, UserRole, Lawyer, Client, ChatMessage, Admin, Report, ReportStatus } from './types';
import { USERS, POSTS, CHATS, REPORTS } from './constants';
import { LawyerProfileModal } from './components/dashboard/LawyerProfileModal';
import { EditUserModal } from './components/dashboard/EditUserModal';
import { ReportModal } from './components/common/ReportModal';
import { EditPostModal } from './components/dashboard/EditPostModal';

const App: React.FC = () => {
  const [disclaimerAgreed, setDisclaimerAgreed] = useState<boolean>(() => JSON.parse(localStorage.getItem('disclaimerAgreed') || 'false'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState<User[]>(USERS);
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [chats, setChats] = useState<Chat[]>(CHATS);
  const [reports, setReports] = useState<Report[]>(REPORTS);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [adminViewingChatId, setAdminViewingChatId] = useState<string | null>(null);
  const [viewingLawyerProfile, setViewingLawyerProfile] = useState<Lawyer | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [reportingTarget, setReportingTarget] = useState<{type: 'user' | 'post', id: number, name: string} | null>(null);


  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
     localStorage.setItem('disclaimerAgreed', JSON.stringify(disclaimerAgreed));
  }, [disclaimerAgreed])

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleRegister = (newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    // Also update current user if they are the one being edited
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  }

  const handleUpdateUsersBatch = (updatedUsers: User[]) => {
      const updatedUserMap = new Map(updatedUsers.map(u => [u.id, u]));
      setUsers(prevUsers => prevUsers.map(u => updatedUserMap.get(u.id) || u));
  }
  
  const handleDeleteUser = (userId: number) => {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
  }

  const handleAddPost = (postData: Omit<Post, 'id' | 'createdAt' | 'comments'>) => {
    const newPost: Post = {
        ...postData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        comments: [],
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };
  
  const handleDeletePost = (postId: number) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  };

  const handleCommentSubmit = (postId: number, comment: Comment) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    ));
  };

  const handleSelectLawyer = (lawyerId: number) => {
    if (currentUser?.role !== UserRole.Client) return;
    const clientId = currentUser.id;
    const participantIds = [clientId, lawyerId].sort((a, b) => a - b) as [number, number];
    const chatId = `chat-${participantIds[0]}-${participantIds[1]}`;
    
    if (!chats.find(c => c.id === chatId)) {
        const newChat: Chat = {
            id: chatId,
            participantIds,
            messages: [],
        };
        setChats(prevChats => [...prevChats, newChat]);
    }
    setActiveChatId(chatId);
  };

  const handleAdminStartChat = (userId: number) => {
    if (!currentUser || currentUser.role !== UserRole.Admin) return;
    const adminId = currentUser.id;
    const participantIds = [adminId, userId].sort((a, b) => a - b) as [number, number];
    const chatId = `chat-${participantIds[0]}-${participantIds[1]}`;
    
    if (!chats.find(c => c.id === chatId)) {
        const newChat: Chat = {
            id: chatId,
            participantIds,
            messages: [],
        };
        setChats(prevChats => [...prevChats, newChat]);
    }
    setActiveChatId(chatId);
  };

  const handleSendMessage = (chatId: string, message: ChatMessage) => {
    setChats(prevChats => prevChats.map(chat => 
        chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat
    ));
  };
  
  const handleRateLawyer = (lawyerId: number, rating: number, review: string) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === lawyerId && user.role === UserRole.Lawyer) {
        const lawyer = user as Lawyer;
        const newReviews = review.trim() ? [...lawyer.reviews, review.trim()] : lawyer.reviews;
        
        const totalRatingPoints = (lawyer.rating * lawyer.numberOfRatings) + rating;
        const newNumberOfRatings = lawyer.numberOfRatings + 1;
        const newAverageRating = newNumberOfRatings > 0 ? totalRatingPoints / newNumberOfRatings : 0;
        
        return {
          ...lawyer,
          reviews: newReviews,
          rating: parseFloat(newAverageRating.toFixed(1)),
          numberOfRatings: newNumberOfRatings,
        };
      }
      return user;
    }));
    alert('شكراً لتقييمك!');
    setViewingLawyerProfile(null);
  };

  const handleOpenReportModal = (type: 'user' | 'post', id: number, name: string) => {
    setReportingTarget({ type, id, name });
  };

  const handleAddReport = (reason: string) => {
    if (!reportingTarget || !currentUser) return;

    const newReport: Report = {
      id: Date.now(),
      reporterId: currentUser.id,
      reporterName: currentUser.fullName,
      type: reportingTarget.type,
      targetId: reportingTarget.id,
      targetContentPreview: reportingTarget.name,
      reason,
      status: ReportStatus.Pending,
      createdAt: new Date().toISOString(),
    };

    setReports(prev => [...prev, newReport]);
    alert('تم إرسال بلاغك بنجاح. سيتم مراجعته من قبل الإدارة.');
    setReportingTarget(null);
  };
  
  const handleResolveReport = (reportId: number) => {
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: ReportStatus.Resolved } : r));
  };


  const renderDashboard = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case UserRole.Admin:
        return <AdminDashboard 
          currentUser={currentUser as Admin} 
          users={users} 
          posts={posts} 
          chats={chats} 
          reports={reports} 
          onUpdateUser={handleUpdateUser} 
          onUpdateUsersBatch={handleUpdateUsersBatch} 
          onDeletePost={handleDeletePost} 
          onUpdatePost={handleUpdatePost} 
          onTriggerEditPost={setEditingPost}
          onDeleteUser={handleDeleteUser} 
          onViewChat={setAdminViewingChatId} 
          onStartChat={handleAdminStartChat} 
          onRegister={handleRegister} 
          onAddPost={handleAddPost} 
          onViewLawyerProfile={setViewingLawyerProfile} 
          onLogout={handleLogout} 
          onEditUser={setEditingUser} 
          onResolveReport={handleResolveReport}
          onCommentSubmit={handleCommentSubmit}
          onReport={handleOpenReportModal}
        />;
      case UserRole.Lawyer:
        return <LawyerDashboard currentUser={currentUser as Lawyer} posts={posts} chats={chats} users={users} onCommentSubmit={handleCommentSubmit} onChatIconClick={setActiveChatId} onReport={handleOpenReportModal} onLogout={handleLogout}/>;
      case UserRole.Client:
        return <ClientDashboard currentUser={currentUser as Client} posts={posts} chats={chats} users={users} onAddPost={handleAddPost} onUpdatePost={handleUpdatePost} onDeletePost={handleDeletePost} onCommentSubmit={handleCommentSubmit} onSelectLawyer={handleSelectLawyer} onChatIconClick={setActiveChatId} onViewLawyerProfile={setViewingLawyerProfile} onReport={handleOpenReportModal} onLogout={handleLogout} onEditPost={setEditingPost} />;
      default:
        return <div>Unknown user role</div>;
    }
  };
  
  const activeChat = chats.find(c => c.id === activeChatId);
  const adminViewingChat = chats.find(c => c.id === adminViewingChatId);

  if (!disclaimerAgreed) {
      return <Disclaimer onAgree={() => setDisclaimerAgreed(true)} />
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen">
      {!currentUser ? (
        <Auth users={users} onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <>
          {renderDashboard()}

          {activeChat && currentUser && (() => {
              const otherUserId = activeChat.participantIds.find(id => id !== currentUser.id);
              const otherUser = users.find(u => u.id === otherUserId);
              return (
                <ChatWindow 
                  chat={activeChat}
                  currentUser={currentUser}
                  otherUserName={otherUser?.fullName || 'مستخدم'}
                  onSendMessage={handleSendMessage}
                  onClose={() => setActiveChatId(null)}
                />
              )
          })()}

           {adminViewingChat && (() => {
              const [p1Id, p2Id] = adminViewingChat.participantIds;
              const p1 = users.find(u => u.id === p1Id);
              const p2 = users.find(u => u.id === p2Id);
              return (
                 <ChatWindow 
                    chat={adminViewingChat}
                    currentUser={currentUser}
                    otherUserName={`محادثة بين ${p1?.fullName || '?'} و ${p2?.fullName || '?'}`}
                    onSendMessage={() => {}} // No sending for admin
                    onClose={() => setAdminViewingChatId(null)}
                    isReadOnly={true}
                  />
              )
           })()}

          {viewingLawyerProfile && currentUser && (
              <LawyerProfileModal
                lawyer={viewingLawyerProfile}
                onClose={() => setViewingLawyerProfile(null)}
                currentUser={currentUser}
                onRateLawyer={handleRateLawyer}
                onReportUser={(userId, userName) => handleOpenReportModal('user', userId, userName)}
              />
          )}
          {editingUser && (
            <EditUserModal 
              user={editingUser}
              onClose={() => setEditingUser(null)}
              onSave={(updatedUser) => {
                handleUpdateUser(updatedUser);
                setEditingUser(null);
              }}
            />
          )}
           {editingPost && (
            <EditPostModal
              post={editingPost}
              // Fix: Corrected function call from onUpdatePost to handleUpdatePost.
              onSave={(updatedPost) => { handleUpdatePost(updatedPost); setEditingPost(null); }}
              onClose={() => setEditingPost(null)}
            />
          )}
           {reportingTarget && (
            <ReportModal
              isOpen={!!reportingTarget}
              onClose={() => setReportingTarget(null)}
              onSubmit={handleAddReport}
              targetName={reportingTarget.name}
              targetType={reportingTarget.type}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
