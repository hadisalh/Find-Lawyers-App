import React, { useState } from 'react';
import { User, Lawyer, Client, UserRole, LawyerStatus, Post, Chat, Admin, AccountStatus } from '../../types';
import { BriefcaseIcon, UserIcon, CheckBadgeIcon, XCircleIcon, TrashIcon, PencilIcon, EyeIcon, PlusIcon, ShieldCheckIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, NoSymbolIcon } from '../ui/icons';

interface AdminDashboardProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  chats: Chat[];
  onViewChat: (chatId: string) => void;
  onEditPost: (post: Post) => void;
  onVerifyLawyer: (lawyer: Lawyer) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, setUsers, posts, setPosts, chats, onViewChat, onEditPost, onVerifyLawyer }) => {
  const [activeTab, setActiveTab] = useState('lawyers'); 
  
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const lawyers = users.filter(u => u.role === UserRole.Lawyer) as Lawyer[];
  const clients = users.filter(u => u.role === UserRole.Client) as Client[];
  const admins = users.filter(u => u.role === UserRole.Admin) as Admin[];
  
  const pendingLawyers = lawyers.filter(l => l.status === LawyerStatus.Pending);
  const registeredLawyers = lawyers.filter(l => l.status === LawyerStatus.Approved);

  const handleUserAccountStatusChange = (userId: number, newStatus: AccountStatus) => {
    setUsers(currentUsers => currentUsers.map(user => 
      user.id === userId ? { ...user, accountStatus: newStatus } : user
    ));
  };

  const deleteUser = (userId: number) => {
     if (userId === 1) { alert('لا يمكن حذف المدير الخارق.'); return; }
    if(window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
    }
  };

  const deletePost = (postId: number) => {
     if(window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
       setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
     }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (!adminName || !adminEmail || !adminPhone || !adminPassword) {
      setAdminError('يرجى ملء جميع الحقول.'); return;
    }
    const newAdmin: Admin = { 
      id: Date.now(), 
      fullName: adminName, 
      email: adminEmail, 
      phone: adminPhone, 
      password: adminPassword, 
      role: UserRole.Admin,
      accountStatus: AccountStatus.Active
    };
    setUsers(prev => [...prev, newAdmin]);
    setAdminName(''); setAdminEmail(''); setAdminPhone(''); setAdminPassword('');
    alert('تمت إضافة المشرف بنجاح.');
  };
  
  const TABS = [
    { key: 'lawyers', label: 'المحامون', icon: <BriefcaseIcon className="w-6 h-6"/>, count: pendingLawyers.length },
    { key: 'clients', label: 'العملاء', icon: <UserIcon className="w-6 h-6"/> },
    { key: 'posts', label: 'المنشورات', icon: <DocumentTextIcon className="w-6 h-6"/> },
    { key: 'chats', label: 'الدردشات', icon: <ChatBubbleLeftRightIcon className="w-6 h-6"/> },
    { key: 'admins', label: 'المشرفون', icon: <ShieldCheckIcon className="w-6 h-6"/> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'lawyers': return renderLawyerManagement();
      case 'clients': return renderClientManagement();
      case 'posts': return renderPostsManagement();
      case 'chats': return renderChatsManagement();
      case 'admins': return renderAdminsManagement();
      default: return null;
    }
  };
  
  const ManagementCard: React.FC<{title: string, children: React.ReactNode, count?: number}> = ({title, count, children}) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title} {count !== undefined && `(${count})`}</h3>
        <div className="space-y-4">{children}</div>
    </div>
  );

  const ActionButton: React.FC<{onClick: () => void, icon: React.ReactNode, label: string, colorClass: string}> = ({ onClick, icon, label, colorClass }) => (
      <button onClick={onClick} className={`flex items-center justify-center gap-2 text-sm font-bold py-2 px-3 rounded-lg transition-colors ${colorClass}`}>
          {icon}
          <span className="hidden sm:inline">{label}</span>
      </button>
  );

  const renderLawyerManagement = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <ManagementCard title="طلبات التسجيل المعلقة" count={pendingLawyers.length}>
        {pendingLawyers.length > 0 ? pendingLawyers.map(lawyer => (
          <div key={lawyer.id} className="bg-yellow-50 p-4 rounded-lg flex flex-wrap justify-between items-center gap-4 border border-yellow-200">
            <div>
              <p className="font-bold text-lg text-gray-800">{lawyer.fullName}</p>
              <p className="text-sm text-gray-600">{lawyer.specialty}</p>
            </div>
            <ActionButton onClick={() => onVerifyLawyer(lawyer)} icon={<EyeIcon />} label="عرض التفاصيل" colorClass="bg-blue-100 text-blue-800 hover:bg-blue-200" />
          </div>
        )) : <p className="text-gray-500 text-center py-4">لا توجد طلبات معلقة حاليًا.</p>}
      </ManagementCard>
      <ManagementCard title="المحامون المسجلون" count={registeredLawyers.length}>
        {registeredLawyers.map(lawyer => (
            <div key={lawyer.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
                <div>
                    <p className="font-bold text-lg">{lawyer.fullName}</p>
                    <p className={`text-sm font-semibold ${lawyer.accountStatus === AccountStatus.Banned ? 'text-red-600' : 'text-gray-600'}`}>{lawyer.accountStatus === AccountStatus.Banned ? 'محظور' : lawyer.specialty}</p>
                </div>
                 <div className="flex gap-2">
                    {lawyer.accountStatus === AccountStatus.Active ? (
                         <ActionButton onClick={() => handleUserAccountStatusChange(lawyer.id, AccountStatus.Banned)} icon={<NoSymbolIcon />} label="حظر" colorClass="bg-red-100 text-red-800 hover:bg-red-200" />
                    ) : (
                         <ActionButton onClick={() => handleUserAccountStatusChange(lawyer.id, AccountStatus.Active)} icon={<CheckBadgeIcon />} label="رفع الحظر" colorClass="bg-green-100 text-green-800 hover:bg-green-200" />
                    )}
                </div>
            </div>
        ))}
      </ManagementCard>
    </div>
  );

  const renderClientManagement = () => (
    <ManagementCard title="العملاء المسجلون" count={clients.length}>
      {clients.map(client => (
        <div key={client.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
          <div>
            <p className="font-bold text-lg">{client.fullName}</p>
            {client.accountStatus === AccountStatus.Banned && <p className="text-sm font-semibold text-red-600">محظور</p>}
          </div>
           <div className="flex gap-2">
              {client.accountStatus === AccountStatus.Active ? (
                   <ActionButton onClick={() => handleUserAccountStatusChange(client.id, AccountStatus.Banned)} icon={<NoSymbolIcon />} label="حظر" colorClass="bg-red-100 text-red-800 hover:bg-red-200" />
              ) : (
                   <ActionButton onClick={() => handleUserAccountStatusChange(client.id, AccountStatus.Active)} icon={<CheckBadgeIcon />} label="رفع الحظر" colorClass="bg-green-100 text-green-800 hover:bg-green-200" />
              )}
              <ActionButton onClick={() => deleteUser(client.id)} icon={<TrashIcon />} label="حذف" colorClass="bg-slate-200 text-slate-800 hover:bg-slate-300" />
            </div>
        </div>
      ))}
    </ManagementCard>
  );
  
  const renderPostsManagement = () => (
    <ManagementCard title="جميع المنشورات" count={posts.length}>
      {posts.map(post => (
        <div key={post.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="font-bold text-lg">{post.title}</p>
              <p className="text-sm text-gray-600">بواسطة: {post.clientName}</p>
              <p className="mt-2 text-gray-800 text-md">{post.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <ActionButton onClick={() => onEditPost(post)} icon={<PencilIcon />} label="تعديل" colorClass="bg-blue-100 text-blue-800 hover:bg-blue-200" />
              <ActionButton onClick={() => deletePost(post.id)} icon={<TrashIcon />} label="حذف" colorClass="bg-red-100 text-red-800 hover:bg-red-200" />
            </div>
          </div>
        </div>
      ))}
    </ManagementCard>
  );

  const renderChatsManagement = () => (
    <ManagementCard title="جميع الدردشات" count={chats.length}>
      {chats.map(chat => {
        const client = users.find(u => u.id === chat.clientId);
        const lawyer = users.find(u => u.id === chat.lawyerId);
        return (
          <div key={chat.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
            <div>
              <p className="font-bold text-lg">{client?.fullName} &harr; {lawyer?.fullName}</p>
              <p className="text-sm text-gray-600">{chat.messages.length} رسائل</p>
            </div>
            <ActionButton onClick={() => onViewChat(chat.id)} icon={<EyeIcon />} label="مشاهدة" colorClass="bg-indigo-100 text-indigo-800 hover:bg-indigo-200" />
          </div>
        );
      })}
    </ManagementCard>
  );
  
  const renderAdminsManagement = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><PlusIcon/> إضافة مشرف جديد</h3>
        <form onSubmit={handleAddAdmin} className="space-y-4">
           {adminError && <p className="text-red-600 font-semibold">{adminError}</p>}
          <input value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="الاسم الكامل" className="w-full p-3 border border-slate-300 rounded-lg"/>
          <input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full p-3 border border-slate-300 rounded-lg"/>
          <input value={adminPhone} onChange={e => setAdminPhone(e.target.value)} placeholder="رقم الهاتف" className="w-full p-3 border border-slate-300 rounded-lg"/>
          <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="كلمة المرور" className="w-full p-3 border border-slate-300 rounded-lg"/>
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">إضافة مشرف</button>
        </form>
      </div>
      <ManagementCard title="المشرفون الحاليون" count={admins.length}>
          {admins.map(admin => (
            <div key={admin.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
               <p className="font-bold text-lg">{admin.fullName} {admin.id === 1 && <span className="text-xs font-bold text-green-600 bg-green-100 py-1 px-2 rounded-full">خارق</span>}</p>
               {admin.id !== 1 && (
                <ActionButton onClick={() => deleteUser(admin.id)} icon={<TrashIcon />} label="حذف" colorClass="bg-red-100 text-red-800 hover:bg-red-200" />
               )}
            </div>
          ))}
      </ManagementCard>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">لوحة تحكم المدير</h1>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-4 sm:gap-6 px-4 sm:px-6 overflow-x-auto" aria-label="Tabs">
             {TABS.map(tab => (
                 <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-4 px-2 border-b-4 font-bold text-md sm:text-lg flex items-center gap-2 transition-colors ${activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {tab.count}
                    </span>
                  )}
                </button>
             ))}
          </nav>
        </div>
        <div className="p-4 sm:p-6 bg-slate-50 rounded-b-xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};