import React, { useState, useRef, useEffect } from 'react';
import { Chat, ChatMessage, User } from '../../types';
import { PaperAirplaneIcon, FlagIcon } from '../ui/icons';

interface ChatWindowProps {
  chat: Chat;
  currentUser: User;
  otherUserName: string;
  onSendMessage: (chatId: string, message: ChatMessage) => void;
  onClose: () => void;
  isReadOnly?: boolean;
  onReportMessage: (chatId: string, messageId: number, messageText: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUser, otherUserName, onSendMessage, onClose, isReadOnly = false, onReportMessage }) => {
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
          // In admin view, align messages based on participant index for consistency
          return msg.senderId === chat.participantIds[1];
      }
      return msg.senderId === currentUser.id;
  }

  return (
    <div className="fixed bottom-0 right-0 sm:right-4 md:right-10 w-full sm:w-96 h-full sm:h-[550px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-t-2xl shadow-2xl flex flex-col z-40 transform-gpu">
      <header className="bg-slate-900 text-white p-3 flex justify-between items-center rounded-t-2xl shadow-md">
        <h3 className="font-bold text-lg">{otherUserName}</h3>
        <button onClick={onClose} className="text-slate-300 hover:text-white text-3xl font-light leading-none">&times;</button>
      </header>
      
      <div className="flex-1 p-4 overflow-y-auto bg-slate-100 dark:bg-slate-900 custom-scrollbar">
        {chat.messages.map(msg => (
          <div key={msg.id} className={`flex items-end mb-3 group ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}>
            {!isMyMessage(msg) && !isReadOnly && (
              <button 
                onClick={() => onReportMessage(chat.id, msg.id, msg.text)}
                className="text-slate-400 hover:text-red-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="الإبلاغ عن هذه الرسالة"
              >
                <FlagIcon className="w-4 h-4" />
              </button>
            )}
            <div className={`rounded-2xl py-2 px-4 max-w-[80%] ${isMyMessage(msg) ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'}`}>
              <p className="text-md">{msg.text}</p>
              <p className={`text-xs mt-1 text-right ${isMyMessage(msg) ? 'text-emerald-100' : 'text-slate-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
             {isMyMessage(msg) && !isReadOnly && (
              <div className="w-6 ml-2" />
            )}
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>
      
      {!isReadOnly ? (
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="flex-1 p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            <button type="submit" className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-all transform hover:scale-110 flex-shrink-0" aria-label="إرسال">
              <PaperAirplaneIcon className="w-6 h-6"/>
            </button>
          </div>
        </form>
      ) : (
         <div className="p-3 border-t dark:border-slate-700 text-center bg-slate-100 dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-400 font-semibold">
           وضع القراءة فقط
         </div>
      )}
    </div>
  );
};