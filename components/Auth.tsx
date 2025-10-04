import React, { useState } from 'react';
import { User, UserRole, Lawyer, Client, LawyerSpecialty, LawyerStatus, AccountStatus } from '../types';
import { ScaleIcon, AtSymbolIcon, PhoneIcon, LockClosedIcon, UserIcon } from './ui/icons';

interface AuthProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
}

const InputField: React.FC<{icon: React.ReactNode, children: React.ReactNode}> = ({ icon, children }) => (
    <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
            {icon}
        </div>
        {children}
    </div>
);

export const Auth: React.FC<AuthProps> = ({ users, onLogin, onRegister }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [registerAs, setRegisterAs] = useState<'client' | 'lawyer'>('client');
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSpecialty, setRegSpecialty] = useState<LawyerSpecialty>(LawyerSpecialty.Civil);
  const [regIdUrl, setRegIdUrl] = useState('');
  const [registerError, setRegisterError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const identifier = loginIdentifier.trim().toLowerCase();
    
    const user = users.find(u => 
      u.email.toLowerCase() === identifier || u.phone === identifier
    );

    if (!user) {
      setLoginError('البريد الإلكتروني أو رقم الهاتف غير مسجل.');
      return;
    }
    
    if (user.password !== loginPassword) {
      setLoginError('كلمة المرور غير صحيحة.');
      return;
    }
    
    if (user.accountStatus === AccountStatus.Banned) {
      setLoginError('هذا الحساب محظور. يرجى التواصل مع الإدارة.');
      return;
    }

    if (user.role === UserRole.Lawyer && (user as Lawyer).status === LawyerStatus.Pending) {
      setLoginError('حسابك قيد المراجعة. لا يمكنك تسجيل الدخول حتى تتم الموافقة عليه.');
      return;
    }
    
    onLogin(user);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!regFullName || !regEmail || !regPhone || !regPassword) {
      setRegisterError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }
    if (users.some(u => u.email.toLowerCase() === regEmail.toLowerCase())) {
        setRegisterError('البريد الإلكتروني مسجل بالفعل.');
        return;
    }
    if (users.some(u => u.phone === regPhone)) {
        setRegisterError('رقم الهاتف مسجل بالفعل.');
        return;
    }

    const baseUser = {
      id: Date.now(),
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      accountStatus: AccountStatus.Active,
    };

    let newUser: User;
    if (registerAs === 'client') {
      newUser = { ...baseUser, role: UserRole.Client } as Client;
    } else {
      if (!regIdUrl) {
        setRegisterError('يرجى رفع المستمسكات الثبوتية.');
        return;
      }
      newUser = { ...baseUser, role: UserRole.Lawyer, specialty: regSpecialty, status: LawyerStatus.Pending, rating: 0, reviews: [], wonCases: 0, idUrl: regIdUrl, numberOfRatings: 0 } as Lawyer;
    }

    onRegister(newUser);
    alert(registerAs === 'lawyer' ? 'تم التسجيل بنجاح! سيتم مراجعة حسابك من قبل الإدارة.' : 'تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.');
    setIsLoginView(true);
    setRegFullName(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); setRegSpecialty(LawyerSpecialty.Civil); setRegIdUrl('');
  };

  const commonInputClasses = "w-full p-3 pr-12 bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition";
  const primaryButtonClasses = "w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300";

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-6">
      <h2 className="text-3xl font-extrabold text-center text-slate-800">تسجيل الدخول</h2>
      {loginError && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center font-semibold">{loginError}</p>}
      <InputField icon={<AtSymbolIcon className="w-5 h-5" />}>
        <input type="text" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} placeholder="البريد الإلكتروني أو رقم الهاتف" className={commonInputClasses} required />
      </InputField>
      <InputField icon={<LockClosedIcon className="w-5 h-5" />}>
        <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="كلمة المرور" className={commonInputClasses} required />
      </InputField>
      <button type="submit" className={primaryButtonClasses}>دخول</button>
      <p className="text-center mt-4 text-slate-600">
        ليس لديك حساب؟ <button type="button" onClick={() => setIsLoginView(false)} className="font-semibold text-emerald-600 hover:underline">سجل الآن</button>
      </p>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleRegister} className="space-y-4">
        <h2 className="text-3xl font-extrabold text-center text-slate-800">إنشاء حساب جديد</h2>
        {registerError && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center font-semibold">{registerError}</p>}
        <div className="flex justify-center bg-slate-100 p-1 rounded-lg">
            <button type="button" onClick={() => setRegisterAs('client')} className={`w-1/2 py-2 px-4 font-bold rounded-md transition-all duration-300 ${registerAs === 'client' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500'}`}>عميل</button>
            <button type="button" onClick={() => setRegisterAs('lawyer')} className={`w-1/2 py-2 px-4 font-bold rounded-md transition-all duration-300 ${registerAs === 'lawyer' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500'}`}>محامي</button>
        </div>
        
        <InputField icon={<UserIcon className="w-5 h-5"/>}><input value={regFullName} onChange={e => setRegFullName(e.target.value)} placeholder="الاسم الثلاثي" className={commonInputClasses} required /></InputField>
        <InputField icon={<PhoneIcon className="w-5 h-5" />}><input value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="رقم الهاتف" className={commonInputClasses} required /></InputField>
        <InputField icon={<AtSymbolIcon className="w-5 h-5" />}><input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="البريد الإلكتروني" className={commonInputClasses} required /></InputField>
        <InputField icon={<LockClosedIcon className="w-5 h-5" />}><input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="كلمة المرور" className={commonInputClasses} required /></InputField>
        
        {registerAs === 'lawyer' && (
            <>
                <select value={regSpecialty} onChange={e => setRegSpecialty(e.target.value as LawyerSpecialty)} className={`${commonInputClasses} pr-4 appearance-none`}>
                    {Object.values(LawyerSpecialty).map(spec => <option key={spec} value={spec}>{spec}</option>)}
                </select>
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">رفع المستمسكات الثبوتية (بطاقة/هوية)</label>
                    <input type="file" onChange={(e) => { if (e.target.files?.length) { setRegIdUrl(URL.createObjectURL(e.target.files[0])); } }} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" required />
                </div>
            </>
        )}
        
        <button type="submit" className={primaryButtonClasses}>تسجيل</button>
         <p className="text-center mt-4 text-slate-600">
            لديك حساب بالفعل؟ <button type="button" onClick={() => setIsLoginView(true)} className="font-semibold text-emerald-600 hover:underline">سجل الدخول</button>
        </p>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <div className="flex items-center gap-3 mb-8">
            <ScaleIcon className="w-16 h-16" />
            <h1 className="text-4xl font-extrabold text-slate-800">محامي العراق</h1>
        </div>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {isLoginView ? renderLoginForm() : renderRegisterForm()}
      </div>
    </div>
  );
};