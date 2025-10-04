import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Header } from './components/common/Header';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { LawyerDashboard } from './components/dashboard/LawyerDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { ChatWindow } from './components/chat/ChatWindow';
import { Disclaimer } from './components/Disclaimer';
import { User, Post, Chat, Comment, UserRole, Lawyer, Client, ChatMessage, Admin } from './types';
import { USERS, POSTS, CHATS } from './constants';
import { LawyerProfileModal } from './components/dashboard/LawyerProfileModal';

const App: React.FC = () => {
  const [disclaimerAgreed, setDisclaimerAgreed] = useState<boolean>(() => JSON.parse(localStorage.getItem('disclaimerAgreed') || 'false'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState<User[]>(USERS);
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [chats, setChats] = useState<Chat[]>(CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [adminViewingChatId, setAdminViewingChatId] = useState<string | null>(null);
  const [viewingLawyerProfile, setViewingLawyerProfile] = useState<Lawyer | null>(null);

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
    const chatId = `client-${clientId}-lawyer-${lawyerId}`;
    
    if (!chats.find(c => c.id === chatId)) {
        const newChat: Chat = {
            id: chatId,
            clientId,
            lawyerId,
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

  const renderDashboard = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case UserRole.Admin:
        return <AdminDashboard currentUser={currentUser as Admin} users={users} posts={posts} chats={chats} onUpdateUser={handleUpdateUser} onUpdateUsersBatch={handleUpdateUsersBatch} onDeletePost={handleDeletePost} onDeleteUser={handleDeleteUser} onViewChat={setAdminViewingChatId} onRegister={handleRegister} onViewLawyerProfile={setViewingLawyerProfile} />;
      case UserRole.Lawyer:
        return <LawyerDashboard currentUser={currentUser as Lawyer} posts={posts} chats={chats} users={users} onCommentSubmit={handleCommentSubmit} onChatIconClick={setActiveChatId}/>;
      case UserRole.Client:
        return <ClientDashboard currentUser={currentUser as Client} posts={posts} chats={chats} users={users} onAddPost={handleAddPost} onUpdatePost={handleUpdatePost} onDeletePost={handleDeletePost} onCommentSubmit={handleCommentSubmit} onSelectLawyer={handleSelectLawyer} onChatIconClick={setActiveChatId} onViewLawyerProfile={setViewingLawyerProfile}/>;
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
    <div className="bg-slate-50 min-h-screen font-sans">
      {!currentUser ? (
        <Auth users={users} onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <>
          <Header user={currentUser} onLogout={handleLogout} />
          <main>
            {renderDashboard()}
          </main>
          {activeChat && (
              <ChatWindow 
                chat={activeChat}
                currentUser={currentUser}
                otherUserName={
                    currentUser.role === UserRole.Client 
                    ? users.find(u => u.id === activeChat.lawyerId)?.fullName || 'محامي'
                    : users.find(u => u.id === activeChat.clientId)?.fullName || 'عميل'
                }
                onSendMessage={handleSendMessage}
                onClose={() => setActiveChatId(null)}
              />
          )}
           {adminViewingChat && (
              <ChatWindow 
                chat={adminViewingChat}
                currentUser={currentUser}
                otherUserName={`محادثة بين ${users.find(u => u.id === adminViewingChat.clientId)?.fullName} و ${users.find(u => u.id === adminViewingChat.lawyerId)?.fullName}`}
                onSendMessage={() => {}} // No sending for admin
                onClose={() => setAdminViewingChatId(null)}
                isReadOnly={true}
              />
          )}
          {viewingLawyerProfile && currentUser && (
              <LawyerProfileModal
                lawyer={viewingLawyerProfile}
                onClose={() => setViewingLawyerProfile(null)}
                currentUser={currentUser}
                onRateLawyer={handleRateLawyer}
              />
          )}
        </>
      )}
    </div>
  );
};

export default App;