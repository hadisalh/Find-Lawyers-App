import React, { useState } from 'react';
import { User, Post, Chat, Lawyer, UserRole, LawyerStatus, AccountStatus, Admin } from '../../types';
import { LawyerVerificationModal } from './LawyerVerificationModal';
import { LawyerProfileModal } from './LawyerProfileModal';
import { UserIcon, EyeIcon, TrashIcon, CheckCircleIcon, XCircleIcon, BriefcaseIcon, PlusIcon, LockClosedIcon, PhoneIcon, AtSymbolIcon } from '../ui/icons';

interface AdminDashboardProps {
  users: User[];
  posts: Post[];
  chats: Chat[];
  onUpdateUser: (updatedUser: User) => void;
  onUpdateUsersBatch: (updatedUsers: User[]) => void;
  onDeletePost: (postId: number) => void;
  onViewChat: (chatId: string) => void;
  onRegister: (newUser: User) => void;
  onViewLawyerProfile: (lawyer: Lawyer) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  posts,
  chats,
  onUpdateUser,
  onUpdateUsersBatch,
  onDeletePost,
  onViewChat,
  onRegister,
  onViewLawyerProfile
}) => {
  const [verifyingLawyer, setVerifyingLawyer] = useState<Lawyer | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'posts' | 'chats' | 'admins'>('requests');
  
  // Admin registration form state
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const lawyers = users.filter(u => u.role === UserRole.Lawyer) as Lawyer[];
  const pendingLawyers = lawyers.filter(l => l.status === LawyerStatus.Pending);
  const allOtherUsers = users.filter(u => u.role !== UserRole.Admin);
  const admins = users.filter(u => u.role === UserRole.Admin);

  const handleStatusChange = (lawyerId: number, newStatus: LawyerStatus) => {
    const lawyer = users.find(u => u.id === lawyerId) as Lawyer;
    if (lawyer) {
      // Fix: Create an intermediate variable for the updated lawyer to satisfy TypeScript's
      // type checking, as `onUpdateUser` expects a `User` but was being passed an
      // object literal with a `Lawyer`-specific property.
      const updatedLawyer: Lawyer = { ...lawyer, status: newStatus };
      onUpdateUser(updatedLawyer);
    }
  };

  const handleAccountStatusChange = (userId: number, newStatus: AccountStatus) => {
    const user = users.find(u => u.id === userId);
    if (user && window.confirm(`هل أنت متأكد من ${newStatus === AccountStatus.Banned ? 'حظر' : 'إلغاء حظر'} هذا المستخدم؟`)) {
        onUpdateUser({ ...user, accountStatus: newStatus });
    }
  };
  
  const handleAdminRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if(!adminName || !adminEmail || !adminPhone || !adminPassword) {
        setAdminError('يرجى ملء جميع الحقول.');
        return;
    }
    if (users.some(u => u.email.toLowerCase() === adminEmail.toLowerCase() || u.phone === adminPhone)) {
        setAdminError('البريد الإلكتروني أو رقم الهاتف مسجل بالفعل.');
        return;
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
    onRegister(newAdmin);
    alert('تم تعيين المشرف بنجاح!');
    setAdminName(''); setAdminEmail(''); setAdminPhone(''); setAdminPassword('');
  }

  const renderStatusBadge = (status: LawyerStatus) => {
    const styles = {
      [LawyerStatus.Approved]: 'bg-green-100 text-green-800',
      [LawyerStatus.Pending]: 'bg-yellow-100 text-yellow-800',
      [LawyerStatus.Rejected]: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
  };
  
  const renderAccountStatusBadge = (status: AccountStatus) => {
    const styles = {
      [AccountStatus.Active]: 'bg-blue-100 text-blue-800',
      [AccountStatus.Banned]: 'bg-gray-200 text-gray-800',
    };
     return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
  }

  const TabButton: React.FC<{tab: typeof activeTab, label: string, count?: number}> = ({tab, label, count}) => (
    <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
      {label} {typeof count !== 'undefined' && <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? 'bg-white text-blue-600' : 'bg-slate-300 text-slate-600'}`}>{count}</span>}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return (
          <div className="space-y-4">
            {pendingLawyers.length > 0 ? pendingLawyers.map(lawyer => (
              <div key={lawyer.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-gray-800">{lawyer.fullName}</p>
                  <p className="text-sm text-gray-600">{lawyer.specialty}</p>
                </div>
                <button onClick={() => setVerifyingLawyer(lawyer)} className="bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors">مراجعة الطلب</button>
              </div>
            )) : <p className="text-center text-gray-600 py-8">لا توجد طلبات تحقق جديدة.</p>}
          </div>
        );
      case 'users':
        return (
          <div className="overflow-x-auto bg-white rounded-lg shadow border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستخدم</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allOtherUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role === UserRole.Lawyer ? `محامي (${(user as Lawyer).specialty})` : 'عميل'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {user.role === UserRole.Lawyer && renderStatusBadge((user as Lawyer).status)}
                        {renderAccountStatusBadge(user.accountStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {user.role === UserRole.Lawyer && <button onClick={() => onViewLawyerProfile(user as Lawyer)} className="text-blue-600 hover:text-blue-900">عرض</button>}
                      {user.accountStatus === AccountStatus.Active ?
                        <button onClick={() => handleAccountStatusChange(user.id, AccountStatus.Banned)} className="text-red-600 hover:text-red-900">حظر</button>
                        : <button onClick={() => handleAccountStatusChange(user.id, AccountStatus.Active)} className="text-green-600 hover:text-green-900">إلغاء الحظر</button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        case 'posts':
            return (
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg text-gray-800">{post.title}</p>
                                <p className="text-sm text-gray-600">بواسطة: {post.clientName}</p>
                            </div>
                            <button onClick={() => window.confirm('هل أنت متأكد؟') && onDeletePost(post.id)} className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition">
                                <TrashIcon className="w-5 h-5 text-red-600" />
                            </button>
                        </div>
                    ))}
                </div>
            );
        case 'chats':
            return (
                <div className="space-y-3">
                    {chats.map(chat => {
                        const client = users.find(u => u.id === chat.clientId);
                        const lawyer = users.find(u => u.id === chat.lawyerId);
                        return (
                            <div key={chat.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{client?.fullName} <span className="font-normal text-gray-500">↔</span> {lawyer?.fullName}</p>
                                    <p className="text-sm text-gray-500">{chat.messages.length} رسائل</p>
                                </div>
                                <button onClick={() => onViewChat(chat.id)} className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition">
                                    <EyeIcon className="w-5 h-5 text-blue-600" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            );
        case 'admins':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">المشرفون الحاليون</h3>
                        <div className="space-y-3">
                            {admins.map(admin => (
                                <div key={admin.id} className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="font-bold text-gray-800">{admin.fullName}</p>
                                    <p className="text-sm text-gray-500">{admin.email}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                         <h3 className="text-2xl font-bold text-gray-800 mb-4">تعيين مشرف جديد</h3>
                         <form onSubmit={handleAdminRegister} className="space-y-4">
                            {adminError && <p className="text-red-600 text-sm">{adminError}</p>}
                            <input value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="الاسم الكامل" className="w-full p-2 border rounded" required/>
                            <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full p-2 border rounded" required/>
                            <input value={adminPhone} onChange={e => setAdminPhone(e.target.value)} placeholder="رقم الهاتف" className="w-full p-2 border rounded" required/>
                            <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="كلمة المرور" className="w-full p-2 border rounded" required/>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">إضافة مشرف</button>
                         </form>
                    </div>
                </div>
            )
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">لوحة تحكم المدير</h2>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <TabButton tab="requests" label="طلبات التحقق" count={pendingLawyers.length} />
        <TabButton tab="users" label="إدارة المستخدمين" />
        <TabButton tab="posts" label="إدارة المنشورات" />
        <TabButton tab="chats" label="مراقبة المحادثات" />
        <TabButton tab="admins" label="إدارة المشرفين" />
      </div>

      <div className="bg-slate-50 p-4 sm:p-6 rounded-lg">
        {renderContent()}
      </div>

      {verifyingLawyer && (
        <LawyerVerificationModal
          lawyer={verifyingLawyer}
          onClose={() => setVerifyingLawyer(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};
