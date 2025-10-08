import React, { useState, useMemo } from 'react';
import { Admin, User, Post, Chat, Report, UserRole, Lawyer, Client, LawyerStatus, AccountStatus, ReportStatus, Comment } from '../../types';
import { DashboardLayout } from './DashboardLayout';
import { ThemeToggle } from '../common/ThemeToggle';
import { LawyerVerificationModal } from './LawyerVerificationModal';
import { ChartPieIcon, UsersIcon, DocumentTextIcon, ChatIcon, FlagIcon, Cog6ToothIcon, ScaleIcon, ArrowLeftOnRectangleIcon, PencilIcon, TrashIcon, EyeIcon, NoSymbolIcon, CheckCircleIcon, UserIcon, XCircleIcon } from '../ui/icons';
import { PostCard } from '../common/PostCard';

interface AdminDashboardProps {
  currentUser: Admin;
  users: User[];
  posts: Post[];
  chats: Chat[];
  reports: Report[];
  onUpdateUser: (updatedUser: User) => void;
  onUpdateUsersBatch: (updatedUsers: User[]) => void;
  onDeletePost: (postId: number) => void;
  onUpdatePost: (post: Post) => void;
  onTriggerEditPost: (post: Post) => void;
  onDeleteUser: (userId: number) => void;
  onViewChat: (chatId: string) => void;
  onStartChat: (userId: number) => void;
  onRegister: (newUser: User) => void;
  onAddPost: (postData: any) => void;
  onViewLawyerProfile: (lawyer: Lawyer) => void;
  onLogout: () => void;
  onEditUser: (user: User) => void;
  onResolveReport: (reportId: number) => void;
  onCommentSubmit: (postId: number, comment: Comment) => void;
  onReport: (type: 'user' | 'post' | 'message', id: number, name: string) => void;
}

type AdminView = 'dashboard' | 'users' | 'posts' | 'reports' | 'chats' | 'settings';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg">
    <div className={`text-white p-4 rounded-full ${color}`}>{icon}</div>
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

export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [verifyingLawyer, setVerifyingLawyer] = useState<Lawyer | null>(null);
  const [viewingReportedPost, setViewingReportedPost] = useState<Post | null>(null);
  const [showAddPostForm, setShowAddPostForm] = useState(false);

  const stats = useMemo(() => {
    return {
      totalUsers: props.users.length,
      totalLawyers: props.users.filter(u => u.role === UserRole.Lawyer).length,
      totalClients: props.users.filter(u => u.role === UserRole.Client).length,
      pendingLawyers: props.users.filter(u => u.role === UserRole.Lawyer && (u as Lawyer).status === LawyerStatus.Pending).length,
      totalPosts: props.posts.length,
      pendingReports: props.reports.filter(r => r.status === ReportStatus.Pending).length,
    };
  }, [props.users, props.posts, props.reports]);
  
  const handleLawyerStatusChange = (lawyerId: number, newStatus: LawyerStatus) => {
    const lawyer = props.users.find(u => u.id === lawyerId) as Lawyer;
    if(lawyer) {
        // Fix: Explicitly create a new Lawyer object to avoid TypeScript error with excess properties on User type.
        const updatedLawyer: Lawyer = { ...lawyer, status: newStatus };
        props.onUpdateUser(updatedLawyer);
    }
  };

  const handleAccountStatusChange = (user: User, newStatus: AccountStatus) => {
      props.onUpdateUser({ ...user, accountStatus: newStatus });
  }

  const handleViewReport = (report: Report) => {
    if (report.type === 'message' && report.context?.chatId) {
        props.onViewChat(report.context.chatId);
    } else if (report.type === 'user') {
        const user = props.users.find(u => u.id === report.targetId);
        if (user) {
            if (user.role === UserRole.Lawyer) {
                props.onViewLawyerProfile(user as Lawyer);
            } else {
                props.onEditUser(user);
            }
        }
    } else {
        const post = props.posts.find(p => p.id === report.targetId);
        if (post) setViewingReportedPost(post);
    }
};

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 mb-10 px-2 hidden md:flex">
        <ScaleIcon className="w-8 h-8 text-emerald-500" />
        <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
      </div>
      <nav className="flex-grow space-y-2">
        <SidebarLink icon={<ChartPieIcon className="w-5 h-5"/>} label="الإحصائيات" isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
        <SidebarLink icon={<UsersIcon className="w-5 h-5"/>} label="إدارة المستخدمين" isActive={activeView === 'users'} onClick={() => setActiveView('users')} />
        <SidebarLink icon={<DocumentTextIcon className="w-5 h-5"/>} label="إدارة المنشورات" isActive={activeView === 'posts'} onClick={() => setActiveView('posts')} />
        <SidebarLink icon={<FlagIcon className="w-5 h-5"/>} label="إدارة البلاغات" isActive={activeView === 'reports'} onClick={() => setActiveView('reports')} />
        <SidebarLink icon={<ChatIcon className="w-5 h-5"/>} label="مراقبة المحادثات" isActive={activeView === 'chats'} onClick={() => setActiveView('chats')} />
        <SidebarLink icon={<Cog6ToothIcon className="w-5 h-5"/>} label="الإعدادات" isActive={activeView === 'settings'} onClick={() => setActiveView('settings')} />
      </nav>
       <div className="mt-auto">
        <div className="border-t border-slate-700 py-4 px-2">
          <p className="text-sm text-slate-300">مسؤول النظام،</p>
          <p className="font-bold text-white mb-4">{props.currentUser.fullName}</p>
          <ThemeToggle />
        </div>
        <button onClick={props.onLogout} className="w-full flex items-center gap-3 px-4 py-3 font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors">
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">لوحة الإحصائيات</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard icon={<UsersIcon className="w-6 h-6"/>} label="إجمالي المستخدمين" value={stats.totalUsers} color="bg-blue-500" />
              <StatCard icon={<UserIcon className="w-6 h-6"/>} label="المحامون" value={stats.totalLawyers} color="bg-indigo-500" />
              <StatCard icon={<UserIcon className="w-6 h-6"/>} label="العملاء" value={stats.totalClients} color="bg-sky-500" />
              <StatCard icon={<CheckCircleIcon className="w-6 h-6"/>} label="طلبات محامين معلقة" value={stats.pendingLawyers} color="bg-amber-500" />
              <StatCard icon={<DocumentTextIcon className="w-6 h-6"/>} label="إجمالي المنشورات" value={stats.totalPosts} color="bg-emerald-500" />
              <StatCard icon={<FlagIcon className="w-6 h-6"/>} label="البلاغات المعلقة" value={stats.pendingReports} color="bg-red-500" />
            </div>
          </div>
        );
      case 'users':
        const otherAdmins = props.users.filter(u => u.role === UserRole.Admin && u.id !== 1 && u.id !== props.currentUser.id);
        const superAdmin = props.users.find(u => u.id === 1);
        const clientsAndLawyers = props.users.filter(u => u.role !== UserRole.Admin);
        const usersToShow = [
            ...(props.currentUser.id === 1 ? [superAdmin] : []), 
            ...otherAdmins, 
            ...clientsAndLawyers
        ].filter(Boolean) as User[];


        return (
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">إدارة المستخدمين</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="p-4 font-semibold">الاسم</th>
                    <th className="p-4 font-semibold">الدور</th>
                     <th className="p-4 font-semibold">كلمة المرور</th>
                    <th className="p-4 font-semibold">الحالة</th>
                    <th className="p-4 font-semibold">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {usersToShow.map(user => {
                      const isSuperAdmin = user.id === 1;
                      const isSelf = user.id === props.currentUser.id;
                      const isProtected = isSuperAdmin || (user.role === UserRole.Admin && isSelf && user.id !== 1);
                      const canBan = !isSuperAdmin && !isSelf;

                    return (
                        <tr key={user.id} className={user.accountStatus === AccountStatus.Banned ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                          <td className="p-4 whitespace-nowrap">{user.fullName}{isSuperAdmin && <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mr-2">(خارق)</span>}{isSelf && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mr-2">(أنت)</span>}</td>
                          <td className="p-4 whitespace-nowrap">{user.role}</td>
                          <td className="p-4 whitespace-nowrap">{isSuperAdmin && !isSelf ? '••••••••' : user.password}</td>
                          <td className="p-4 whitespace-nowrap">
                            {user.role === UserRole.Lawyer && (user as Lawyer).status === LawyerStatus.Pending ? (
                                <span className="px-2 py-1 text-xs font-bold text-amber-800 bg-amber-100 rounded-full dark:text-amber-200 dark:bg-amber-900/50">قيد المراجعة</span>
                            ) : (
                                 <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.accountStatus === AccountStatus.Active ? 'text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/50' : 'text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/50'}`}>
                                    {user.accountStatus === AccountStatus.Active ? 'نشط' : 'محظور'}
                                 </span>
                            )}
                          </td>
                          <td className="p-4 flex items-center gap-2">
                            {user.role === UserRole.Lawyer && (user as Lawyer).status === LawyerStatus.Pending && (
                                <button onClick={() => setVerifyingLawyer(user as Lawyer)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="مراجعة الطلب"><CheckCircleIcon className="w-5 h-5"/></button>
                            )}
                            <button onClick={() => props.onEditUser(user)} disabled={isProtected && !isSelf} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed" title="تعديل"><PencilIcon className="w-5 h-5"/></button>
                            {canBan && (
                                user.accountStatus === AccountStatus.Active ? (
                                    <button onClick={() => handleAccountStatusChange(user, AccountStatus.Banned)} className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300" title="حظر"><NoSymbolIcon className="w-5 h-5"/></button>
                                ) : (
                                    <button onClick={() => handleAccountStatusChange(user, AccountStatus.Active)} className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300" title="إلغاء الحظر"><CheckCircleIcon className="w-5 h-5"/></button>
                                )
                            )}
                            <button onClick={() => window.confirm('هل أنت متأكد من حذف هذا المستخدم؟') && props.onDeleteUser(user.id)} disabled={isProtected} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed" title="حذف"><TrashIcon className="w-5 h-5"/></button>
                             <button onClick={() => props.onStartChat(user.id)} disabled={isSelf} className="text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed" title="مراسلة"><ChatIcon className="w-5 h-5"/></button>
                          </td>
                        </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'reports':
        return (
            <div>
                 <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">إدارة البلاغات</h2>
                 <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 overflow-x-auto">
                    <table className="w-full text-right min-w-[800px]">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="p-4 font-semibold">المُبلغ عنه</th>
                                <th className="p-4 font-semibold">النوع</th>
                                <th className="p-4 font-semibold">السبب</th>
                                <th className="p-4 font-semibold">المُبلغ</th>
                                <th className="p-4 font-semibold">الحالة</th>
                                <th className="p-4 font-semibold">الإجراءات</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                             {props.reports.map(report => (
                                 <tr key={report.id}>
                                     <td className="p-4 whitespace-nowrap font-bold">{report.targetContentPreview}</td>
                                     <td className="p-4 whitespace-nowrap">{report.type === 'post' ? 'منشور' : report.type === 'user' ? 'مستخدم' : 'رسالة'}</td>
                                     <td className="p-4 whitespace-normal max-w-xs truncate">{report.reason}</td>
                                     <td className="p-4 whitespace-nowrap">{report.reporterName}</td>
                                     <td className="p-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${report.status === ReportStatus.Pending ? 'text-amber-800 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/50' : 'text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/50'}`}>
                                            {report.status === ReportStatus.Pending ? 'معلق' : 'تم الحل'}
                                        </span>
                                     </td>
                                     <td className="p-4 flex items-center gap-2">
                                        <button onClick={() => handleViewReport(report)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="عرض المحتوى"><EyeIcon className="w-5 h-5"/> <span>عرض</span></button>
                                        {report.status === ReportStatus.Pending && (
                                            <button onClick={() => props.onResolveReport(report.id)} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" title="وضع علامة كمحلول"><CheckCircleIcon className="w-5 h-5"/></button>
                                        )}
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                    </table>
                    {props.reports.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400 py-10">لا توجد بلاغات.</p>}
                 </div>
            </div>
        );
       case 'chats':
         return (
            <div>
                 <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">مراقبة المحادثات</h2>
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border dark:border-slate-700">
                     {props.chats.length > 0 ? (
                         <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                             {props.chats.map(chat => {
                                const p1 = props.users.find(u => u.id === chat.participantIds[0]);
                                const p2 = props.users.find(u => u.id === chat.participantIds[1]);
                                return (
                                    <li key={chat.id} className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer flex justify-between items-center" onClick={() => props.onViewChat(chat.id)}>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{p1?.fullName || '?'} <span className="text-slate-500">↔</span> {p2?.fullName || '?'}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{chat.messages.length} رسائل</p>
                                        </div>
                                        <EyeIcon className="w-6 h-6 text-slate-400"/>
                                    </li>
                                );
                             })}
                         </ul>
                     ) : <p className="text-center text-slate-500 dark:text-slate-400 py-10">لا توجد محادثات.</p>}
                 </div>
            </div>
         );
        case 'posts':
            return (
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">إدارة المنشورات</h2>
                        <button onClick={() => setShowAddPostForm(!showAddPostForm)} className="flex items-center gap-2 bg-emerald-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 shadow-lg">
                            {showAddPostForm ? 'إغلاق' : 'منشور جديد'}
                        </button>
                    </div>
                     {showAddPostForm && (
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const title = formData.get('title') as string;
                                const description = formData.get('description') as string;
                                if(title && description) {
                                    props.onAddPost({ authorId: props.currentUser.id, authorName: props.currentUser.fullName, authorRole: UserRole.Admin, title, description });
                                    setShowAddPostForm(false);
                                }
                            }} className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">أضف منشور جديد</h2>
                                <input name="title" placeholder="عنوان المنشور" className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-lg" required />
                                <textarea name="description" placeholder="محتوى المنشور" className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 rounded-lg" rows={5} required />
                                <div className="flex justify-end">
                                   <button type="submit" className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-600">نشر</button>
                                </div>
                            </form>
                        </div>
                    )}
                    <div className="space-y-6">
                        {props.posts.map(post => (
                            <div key={post.id} className="relative group">
                                <PostCard 
                                    post={post} 
                                    currentUser={props.currentUser} 
                                    onCommentSubmit={props.onCommentSubmit} 
                                    onSelectLawyer={()=>{}}
                                    onReport={props.onReport} 
                                />
                                <div className="absolute top-6 left-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => props.onTriggerEditPost(post)} className="bg-white dark:bg-slate-600 p-2 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-500"><PencilIcon className="w-5 h-5 text-slate-600 dark:text-slate-200" /></button>
                                    <button onClick={() => window.confirm('هل أنت متأكد؟') && props.onDeletePost(post.id)} className="bg-white dark:bg-slate-600 p-2 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-500"><TrashIcon className="w-5 h-5 text-red-600" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'settings':
             return (
                 <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">الإعدادات</h2>
                    <p className="text-slate-600 dark:text-slate-400">هذه المنطقة مخصصة للإعدادات العامة للنظام (لم يتم تنفيذها بعد).</p>
                 </div>
             );
      default:
        return null;
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
      
      {viewingReportedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={() => setViewingReportedPost(null)}>
            <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200">عرض المنشور المبلغ عنه</h2>
                    <button onClick={() => setViewingReportedPost(null)} className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 text-3xl font-light" aria-label="Close">&times;</button>
                </header>
                <main className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <PostCard 
                        post={viewingReportedPost}
                        currentUser={props.currentUser}
                        onCommentSubmit={props.onCommentSubmit}
                        onSelectLawyer={() => {}} 
                        onReport={() => {}}
                    />
                </main>
                <footer className="p-4 bg-white dark:bg-slate-800 flex justify-end gap-3 rounded-b-2xl border-t dark:border-slate-700">
                    <button onClick={() => setViewingReportedPost(null)} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">إغلاق</button>
                    <button 
                        onClick={() => {
                            const postToEdit = viewingReportedPost;
                            setViewingReportedPost(null);
                            props.onTriggerEditPost(postToEdit);
                        }} 
                        className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        <PencilIcon className="w-4 h-4"/> تعديل المنشور
                    </button>
                    <button 
                         onClick={() => {
                            if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟ سيتم حذفه نهائياً.')) {
                                props.onDeletePost(viewingReportedPost.id);
                                setViewingReportedPost(null);
                            }
                        }} 
                        className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                        <TrashIcon className="w-4 h-4"/> حذف المنشور
                    </button>
                </footer>
            </div>
        </div>
    )}
    </>
  );
};
