import React, { useState, useRef, useEffect } from 'react';
import { Chat, ChatMessage, User } from '../../types';
import { PaperAirplaneIcon } from '../ui/icons';

interface ChatWindowProps {
  chat: Chat;
  currentUser: User;
  otherUserName: string;
  onSendMessage: (chatId: string, message: ChatMessage) => void;
  onClose: () => void;
  isReadOnly?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUser, otherUserName, onSendMessage, onClose, isReadOnly = false }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chat.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isReadOnly) return;

    const message: ChatMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    onSendMessage(chat.id, message);
    setNewMessage('');
  };

  const isMyMessage = (msg: ChatMessage) => {
      if (isReadOnly) {
          // In admin view, client is "receiver", lawyer is "sender"
          return msg.senderId === chat.lawyerId;
      }
      return msg.senderId === currentUser.id;
  }

  return (
    <div className="fixed bottom-0 right-0 sm:right-4 md:right-10 w-full sm:w-96 h-full sm:h-[550px] bg-white border border-gray-200 rounded-t-2xl shadow-2xl flex flex-col z-40 transform-gpu">
      <header className="bg-slate-800 text-white p-3 flex justify-between items-center rounded-t-2xl shadow-md">
        <h3 className="font-bold text-lg">{otherUserName}</h3>
        <button onClick={onClose} className="text-slate-300 hover:text-white text-3xl font-light leading-none">&times;</button>
      </header>
      
      <div className="flex-1 p-4 overflow-y-auto bg-slate-100">
        {chat.messages.map(msg => (
          <div key={msg.id} className={`flex mb-3 ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-2xl py-2 px-4 max-w-[80%] ${isMyMessage(msg) ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-200 text-gray-800 rounded-bl-none'}`}>
              <p className="text-md">{msg.text}</p>
              <p className={`text-xs mt-1 text-right ${isMyMessage(msg) ? 'text-blue-200' : 'text-gray-500'}`}>
                {new Date(msg.timestamp).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>
      
      {!isReadOnly ? (
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all transform hover:scale-110 flex-shrink-0" aria-label="إرسال">
              <PaperAirplaneIcon className="w-6 h-6"/>
            </button>
          </div>
        </form>
      ) : (
         <div className="p-3 border-t text-center bg-slate-100 text-sm text-slate-500 font-semibold">
           وضع القراءة فقط
         </div>
      )}
    </div>
  );
};
