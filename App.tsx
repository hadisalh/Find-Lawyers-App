import React, { useState, useEffect } from 'react';
import { User, Post, Chat, UserRole, Lawyer, Comment, ChatMessage, Admin, LawyerStatus, AccountStatus } from './types';
import { USERS, POSTS, CHATS } from './constants';
import { Auth } from './components/Auth';
import { Disclaimer } from './components/Disclaimer';
import { Header } from './components/common/Header';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { LawyerDashboard } from './components/dashboard/LawyerDashboard';
import { ChatWindow } from './components/chat/ChatWindow';
import { LawyerProfileModal } from './components/dashboard/LawyerProfileModal';
import { EditPostModal } from './components/dashboard/EditPostModal';
import { LawyerVerificationModal } from './components/dashboard/LawyerVerificationModal';

function App() {
  const [users, setUsers] = useState<User[]>(USERS);
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [chats, setChats] = useState<Chat[]>(CHATS);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [viewingLawyerProfileId, setViewingLawyerProfileId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [verifyingLawyer, setVerifyingLawyer] = useState<Lawyer | null>(null);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleRegisterUser = (newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveChatId(null);
    setEditingPost(null);
    setViewingLawyerProfileId(null);
    setVerifyingLawyer(null);
  };

  const handleAgreeDisclaimer = () => {
    setShowDisclaimer(false);
  };
  
  const handleCommentSubmit = (postId: number, comment: Comment) => {
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
    ));
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    setEditingPost(null);
  };

  const handleLawyerStatusChange = (lawyerId: number, newStatus: LawyerStatus) => {
    setUsers(currentUsers => currentUsers.map(user => 
        user.id === lawyerId ? { ...user, status: newStatus } as Lawyer : user
    ));
  };
  
  const handleStartChat = (lawyerId: number) => {
    if (!currentUser || currentUser.role !== UserRole.Client) return;

    const chatId = `client-${currentUser.id}-lawyer-${lawyerId}`;
    const existingChat = chats.find(c => c.id === chatId);

    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      const newChat: Chat = { id: chatId, clientId: currentUser.id, lawyerId: lawyerId, messages: [] };
      setChats(prevChats => [...prevChats, newChat]);
      setActiveChatId(newChat.id);
    }
  };

  const handleViewLawyerProfile = (lawyerId: number) => {
    setViewingLawyerProfileId(lawyerId);
  };
  
  const handleSendMessage = (chatId: string, message: ChatMessage) => {
      setChats(chats.map(c => 
        c.id === chatId ? { ...c, messages: [...c.messages, message] } : c
      ));
  };
  
  const activeChat = chats.find(c => c.id === activeChatId);
  let otherUserInChatName = '';
  let isChatReadOnlyForAdmin = false;

  if (activeChat && currentUser) {
      if (currentUser.role === UserRole.Admin) {
          const client = users.find(u => u.id === activeChat.clientId);
          const lawyer = users.find(u => u.id === activeChat.lawyerId);
          otherUserInChatName = `محادثة: ${client?.fullName} و ${lawyer?.fullName}`;
          isChatReadOnlyForAdmin = true;
      } else {
          const otherUserId = currentUser.role === UserRole.Client ? activeChat.lawyerId : activeChat.clientId;
          const otherUser = users.find(u => u.id === otherUserId);
          otherUserInChatName = otherUser?.fullName || 'مستخدم غير معروف';
      }
  }

  const lawyerToView = users.find(u => u.id === viewingLawyerProfileId) as Lawyer | undefined;

  const renderDashboard = () => {
    if (!currentUser) return null;
    
    switch (currentUser.role) {
      case UserRole.Admin:
        return <AdminDashboard users={users} setUsers={setUsers} posts={posts} setPosts={setPosts} chats={chats} onViewChat={setActiveChatId} onEditPost={setEditingPost} onVerifyLawyer={setVerifyingLawyer} />;
      case UserRole.Client:
        return <ClientDashboard currentUser={currentUser} posts={posts} users={users} chats={chats} setPosts={setPosts} onStartChat={handleStartChat} onChatIconClick={setActiveChatId} onViewProfile={handleViewLawyerProfile} />;
      case UserRole.Lawyer:
        return <LawyerDashboard currentUser={currentUser as Lawyer} posts={posts} chats={chats} users={users} onCommentSubmit={handleCommentSubmit} onChatIconClick={setActiveChatId} />;
      default:
        return <div>لوحة تحكم غير معروفة.</div>;
    }
  };
  
  if (showDisclaimer) {
      return <Disclaimer onAgree={handleAgreeDisclaimer} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {!currentUser ? (
        <Auth onLogin={handleLogin} users={users} onRegister={handleRegisterUser} />
      ) : (
        <>
          <Header user={currentUser} onLogout={handleLogout} />
          <main>
            {renderDashboard()}
          </main>
           {activeChat && currentUser && (
              <ChatWindow chat={activeChat} currentUser={currentUser} otherUserName={otherUserInChatName} onSendMessage={handleSendMessage} onClose={() => setActiveChatId(null)} isReadOnly={isChatReadOnlyForAdmin} />
          )}
          {lawyerToView && (
            <LawyerProfileModal lawyer={lawyerToView} onClose={() => setViewingLawyerProfileId(null)} onStartChat={(lawyerId) => { setViewingLawyerProfileId(null); handleStartChat(lawyerId); }} />
          )}
          {editingPost && (
            <EditPostModal post={editingPost} onSave={handleUpdatePost} onClose={() => setEditingPost(null)} />
          )}
          {verifyingLawyer && (
            <LawyerVerificationModal lawyer={verifyingLawyer} onClose={() => setVerifyingLawyer(null)} onStatusChange={handleLawyerStatusChange} />
          )}
        </>
      )}
    </div>
  );
}

export default App;