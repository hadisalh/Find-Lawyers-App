import React, { useState, useMemo } from 'react';
import { Admin, User, Post, Chat, Lawyer, Client, UserRole, LawyerStatus, AccountStatus } from '../../types';
import { DashboardLayout } from './DashboardLayout';
import { LawyerVerificationModal } from './LawyerVerificationModal';
import { EditAdminModal } from './EditAdminModal';
import {
  ChartPieIcon, DocumentTextIcon, UsersIcon, ChatIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, ScaleIcon,
  TrashIcon, PencilIcon, PlusIcon, BriefcaseIcon
} from '../ui/icons';
import { ThemeToggle } from '../common/ThemeToggle';

interface AdminDashboardProps {
  currentUser: Admin;
  users: User[];
  posts: Post[];
  chats: Chat[];
  onUpdateUser: (updatedUser: User) => void;
  onUpdateUsersBatch: (updatedUsers: User[]) => void;
  onDeletePost: (postId: number) => void;
  onDeleteUser: (userId: number) => void;
  onViewChat: (chatId: string) => void;
  onRegister: (newUser: User) => void; // for adding new admins
  onViewLawyerProfile: (lawyer: Lawyer) => void;
  onEditUser: (user: User) => void;
  onLogout: () => void;
}

type AdminView = 'dashboard' | 'lawyers' | 'clients' | 'admins' | 'posts' | 'chats';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className={`text-white p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
);

const SidebarLink: React.FC<{icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void;}> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center w-full text-right gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
        {icon}
        <span>{label}</span>
    </button>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser, users, posts, chats, onUpdateUser, onUpdateUsersBatch, onDeletePost, onDeleteUser, onViewChat, onRegister, onViewLawyerProfile, onLogout, onEditUser
}) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [verifyingLawyer, setVerifyingLawyer] = useState<Lawyer | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isSuperAdmin = currentUser.email === 'hhhhdddd2017@gmail.com';

  // Memoized lists of users
  const lawyers = useMemo(() => users.filter(u => u.role === UserRole.Lawyer) as Lawyer[], [users]);
  const clients = useMemo(() => users.filter(u => u.role === UserRole.Client) as Client[], [users]);
  const admins = useMemo(() => users.filter(u => u.role === UserRole.Admin) as Admin[], [users]);
  
  const handleLawyerStatusChange = (lawyerId: number, newStatus: LawyerStatus) => {
    const lawyer = users.find(u => u.id === lawyerId) as Lawyer;
    if (lawyer) {
      const updatedLawyer = { ...lawyer, status: newStatus };
      onUpdateUser(updatedLawyer);
    }
  };

  const handleAccountStatusChange = (userId: number, newStatus: AccountStatus) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      onUpdateUser({ ...user, accountStatus: newStatus });
    }
  };

  const handleAddAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;

    if (!fullName || !email || !phone || !password) return;
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('Email already exists.');
        return;
    }

    const newAdmin: Admin = {
      id: Date.now(),
      fullName, email, phone, password,
      role: UserRole.Admin,
      accountStatus: AccountStatus.Active,
    };
    onRegister(newAdmin);
    setShowAddAdmin(false);
    e.currentTarget.reset();
  };

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 mb-10 px-2 hidden md:flex">
        <ScaleIcon className="w-8 h-8 text-emerald-500" />
        <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
      </div>
      <nav className="flex-grow space-y-2">
        <SidebarLink icon={<ChartPieIcon className="w-5 h-5"/>} label="نظرة عامة" isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
        <SidebarLink icon={<BriefcaseIcon className="w-5 h-5"/>} label="المحامون" isActive={activeView === 'lawyers'} onClick={() => setActiveView('lawyers')} />
        <SidebarLink icon={<UsersIcon className="w-5 h-5"/>} label="العملاء" isActive={activeView === 'clients'} onClick={() => setActiveView('clients')} />
        <SidebarLink icon={<Cog6ToothIcon className="w-5 h-5"/>} label="المشرفون" isActive={activeView === 'admins'} onClick={() => setActiveView('admins')} />
        <SidebarLink icon={<DocumentTextIcon className="w-5 h-5"/>} label="المنشورات" isActive={activeView === 'posts'} onClick={() => setActiveView('posts')} />
        <SidebarLink icon={<ChatIcon className="w-5 h-5"/>} label="المحادثات" isActive={activeView === 'chats'} onClick={() => setActiveView('chats')} />
      </nav>
      <div className="mt-auto">
        <div className="border-t border-slate-700 py-4 px-2">
            <p className="text-sm text-slate-300">أهلاً بك،</p>
            <p className="font-bold text-white mb-4">{currentUser.fullName}</p>
            <ThemeToggle />
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors">
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>تسجيل الخروج</span>
        </button>
      </div>
    </>
  );

  const renderContent = () => {
    // Shared table styles
    const tableBaseClass = "w-full text-sm text-left text-slate-500 dark:text-slate-400";
    const theadClass = "text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700";
    const thClass = "px-2 py-3 md:px-6";
    const tdClass = "px-2 py-4 md:px-6";
    const trClass = "bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50";

    const filteredUsers = users.filter(u => u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

    switch(activeView) {
      case 'dashboard':
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">نظرة عامة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<BriefcaseIcon className="w-6 h-6"/>} label="إجمالي المحامين" value={lawyers.length} color="bg-blue-500" />
              <StatCard icon={<UsersIcon className="w-6 h-6"/>} label="إجمالي العملاء" value={clients.length} color="bg-green-500" />
              <StatCard icon={<DocumentTextIcon className="w-6 h-6"/>} label="إجمالي المنشورات" value={posts.length} color="bg-amber-500" />
              <StatCard icon={<ChatIcon className="w-6 h-6"/>} label="إجمالي المحادثات" value={chats.length} color="bg-violet-500" />
            </div>
          </>
        );

      case 'lawyers':
        const filteredLawyers = filteredUsers.filter(u => u.role === UserRole.Lawyer) as Lawyer[];
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">إدارة المحامين</h2>
            {/* Search bar could be added here */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 overflow-x-auto">
              <table className={tableBaseClass}>
                <thead className={theadClass}><tr><th className={thClass}>الاسم</th><th className={thClass}>الحالة</th><th className={thClass}>حالة الحساب</th><th className={thClass}>إجراءات</th></tr></thead>
                <tbody>
                  {filteredLawyers.map(lawyer => (
                    <tr key={lawyer.id} className={trClass}>
                      <td className={`${tdClass} text-slate-900 dark:text-white`}><button onClick={() => onViewLawyerProfile(lawyer)} className="font-bold text-blue-600 hover:underline">{lawyer.fullName}</button></td>
                      <td className={tdClass}>{lawyer.status}</td>
                      <td className={tdClass}>{lawyer.accountStatus}</td>
                      <td className={`${tdClass} flex items-center gap-2 sm:gap-4`}>
                        {isSuperAdmin && <button onClick={() => onEditUser(lawyer)} title="تعديل"><PencilIcon className="w-5 h-5 text-slate-500 hover:text-blue-600"/></button>}
                        {lawyer.status === LawyerStatus.Pending && <button onClick={() => setVerifyingLawyer(lawyer)} className="text-blue-600 font-bold">تحقق</button>}
                        {lawyer.accountStatus === AccountStatus.Active ?
                            <button onClick={() => handleAccountStatusChange(lawyer.id, AccountStatus.Banned)} className="text-red-600 font-bold">حظر</button> :
                            <button onClick={() => handleAccountStatusChange(lawyer.id, AccountStatus.Active)} className="text-green-600 font-bold">إلغاء الحظر</button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      // Other cases for clients, admins, posts, chats would follow a similar pattern
      case 'clients':
        const filteredClients = filteredUsers.filter(u => u.role === UserRole.Client) as Client[];
        return (
            <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">إدارة العملاء</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 overflow-x-auto">
                    <table className={tableBaseClass}>
                        <thead className={theadClass}><tr><th className={thClass}>الاسم</th><th className={thClass}>البريد الإلكتروني</th><th className={thClass}>حالة الحساب</th><th className={thClass}>إجراءات</th></tr></thead>
                        <tbody>
                            {filteredClients.map(client => (
                                <tr key={client.id} className={trClass}>
                                    <td className={`${tdClass} text-slate-900 dark:text-white`}>{client.fullName}</td>
                                    <td className={tdClass}>{client.email}</td>
                                    <td className={tdClass}>{client.accountStatus}</td>
                                    <td className={`${tdClass} flex items-center gap-2 sm:gap-4`}>
                                        {isSuperAdmin && <button onClick={() => onEditUser(client)} title="تعديل"><PencilIcon className="w-5 h-5 text-slate-500 hover:text-blue-600"/></button>}
                                        {client.accountStatus === AccountStatus.Active ?
                                            <button onClick={() => handleAccountStatusChange(client.id, AccountStatus.Banned)} className="text-red-600 font-bold">حظر</button> :
                                            <button onClick={() => handleAccountStatusChange(client.id, AccountStatus.Active)} className="text-green-600 font-bold">إلغاء الحظر</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
      
      case 'admins':
        return (
            <>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">إدارة المشرفين</h2>
                    {isSuperAdmin && (
                      <button onClick={() => setShowAddAdmin(!showAddAdmin)} className="flex items-center gap-2 bg-emerald-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 shadow-lg">
                          <PlusIcon className="w-5 h-5" />
                          <span>{showAddAdmin ? 'إغلاق' : 'إضافة مشرف'}</span>
                      </button>
                    )}
                </div>
                {showAddAdmin && isSuperAdmin && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border dark:border-slate-700 mb-8">
                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">إضافة مشرف جديد</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="fullName" placeholder="الاسم الكامل" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-slate-200" required />
                                <input name="email" type="email" placeholder="البريد الإلكتروني" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-slate-200" required />
                                <input name="phone" placeholder="رقم الهاتف" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-slate-200" required />
                                <input name="password" type="password" placeholder="كلمة المرور" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-slate-200" required />
                            </div>
                            <div className="flex justify-end"><button type="submit" className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-600">إضافة</button></div>
                        </form>
                    </div>
                )}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 overflow-x-auto">
                    <table className={tableBaseClass}>
                        <thead className={theadClass}>
                          <tr>
                            <th className={thClass}>الاسم</th>
                            <th className={thClass}>البريد الإلكتروني</th>
                            {isSuperAdmin && <th className={thClass}>إجراءات</th>}
                          </tr>
                        </thead>
                        <tbody>
                            {admins.map(admin => (
                                <tr key={admin.id} className={trClass}>
                                    <td className={`${tdClass} text-slate-900 dark:text-white`}>{admin.fullName}</td>
                                    <td className={tdClass}>{admin.email}</td>
                                    {isSuperAdmin && (
                                      <td className={`${tdClass} flex gap-2 sm:gap-4`}>
                                          <button onClick={() => setEditingAdmin(admin)}><PencilIcon className="w-5 h-5 text-slate-600 dark:text-slate-400 hover:text-blue-600" /></button>
                                          {admin.id !== currentUser.id && <button onClick={() => window.confirm('Are you sure?') && onDeleteUser(admin.id)}><TrashIcon className="w-5 h-5 text-slate-600 dark:text-slate-400 hover:text-red-600" /></button>}
                                      </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );

      case 'posts':
        return (
            <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">إدارة المنشورات</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 overflow-x-auto">
                     <table className={tableBaseClass}>
                        <thead className={theadClass}><tr><th className={thClass}>العنوان</th><th className={thClass}>صاحب المنشور</th><th className={thClass}>تاريخ النشر</th><th className={thClass}>إجراءات</th></tr></thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id} className={trClass}>
                                    <td className={`${tdClass} whitespace-normal break-words text-slate-900 dark:text-white`}>{post.title}</td>
                                    <td className={tdClass}>{post.clientName}</td>
                                    <td className={tdClass}>{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className={tdClass}>
                                        <button onClick={() => window.confirm('Are you sure?') && onDeletePost(post.id)}><TrashIcon className="w-5 h-5 text-red-600"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
      case 'chats':
         return (
            <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">مراقبة المحادثات</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {chats.map(chat => {
                            const client = users.find(u => u.id === chat.clientId);
                            const lawyer = users.find(u => u.id === chat.lawyerId);
                            if (!client || !lawyer) return null;
                            return (
                                <li key={chat.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{client.fullName} &harr; {lawyer.fullName}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{chat.messages.length} رسائل</p>
                                    </div>
                                    <button onClick={() => onViewChat(chat.id)} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">عرض</button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </>
        );
      default: return null;
    }
  };

  return (
    <>
        <DashboardLayout sidebar={sidebarContent}>
            {renderContent()}
        </DashboardLayout>

        {verifyingLawyer && (
            <LawyerVerificationModal
                lawyer={verifyingLawyer}
                onClose={() => setVerifyingLawyer(null)}
                onStatusChange={handleLawyerStatusChange}
            />
        )}
        {editingAdmin && isSuperAdmin && (
            <EditAdminModal
                admin={editingAdmin}
                onClose={() => setEditingAdmin(null)}
                onSave={(updatedAdmin) => {
                    onUpdateUser(updatedAdmin);
                    setEditingAdmin(null);
                }}
            />
        )}
    </>
  );
};