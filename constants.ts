import { User, Post, Chat, UserRole, LawyerStatus, LawyerSpecialty, Lawyer, Client, Admin, AccountStatus } from './types';

export const USERS: User[] = [
  // Admin
  { id: 1, email: 'hhhhdddd2017@gmail.com', fullName: 'المدير الخارق', role: UserRole.Admin, phone: '07700000000', password: 'hadisalh', accountStatus: AccountStatus.Active } as Admin,
  { id: 7, email: 'admin2@app.com', fullName: 'المشرف أحمد', role: UserRole.Admin, phone: '07711111111', password: 'password123', accountStatus: AccountStatus.Active } as Admin,


  // Lawyers
  { id: 2, email: 'lawyer1@app.com', fullName: 'المحامي علي', role: UserRole.Lawyer, specialty: LawyerSpecialty.Criminal, status: LawyerStatus.Approved, rating: 4.8, reviews: ['ممتاز', 'سريع'], wonCases: 25, idUrl: '#', password: 'password123', accountStatus: AccountStatus.Active } as Lawyer,
  { id: 3, email: 'lawyer2@app.com', fullName: 'المحامية فاطمة', role: UserRole.Lawyer, specialty: LawyerSpecialty.Family, status: LawyerStatus.Approved, rating: 4.9, reviews: ['متعاونة جدا'], wonCases: 40, idUrl: '#', password: 'password123', accountStatus: AccountStatus.Active } as Lawyer,
  { id: 4, email: 'lawyer3@app.com', fullName: 'المحامي أحمد', role: UserRole.Lawyer, specialty: LawyerSpecialty.Civil, status: LawyerStatus.Pending, rating: 0, reviews: [], wonCases: 0, idUrl: '#', password: 'password123', accountStatus: AccountStatus.Active } as Lawyer,
  
  // Clients
  { id: 5, email: 'client1@app.com', fullName: 'العميل خالد', role: UserRole.Client, phone: '07811111111', password: 'password123', accountStatus: AccountStatus.Active } as Client,
  { id: 6, email: 'client2@app.com', fullName: 'العميلة سارة', role: UserRole.Client, phone: '07922222222', password: 'password123', accountStatus: AccountStatus.Active } as Client,
];

export const POSTS: Post[] = [
    {
        id: 1,
        clientId: 5,
        clientName: 'العميل خالد',
        title: 'استشارة بخصوص عقد إيجار',
        description: 'أحتاج مساعدة في مراجعة عقد إيجار لشقة سكنية والتأكد من قانونية جميع البنود قبل التوقيع. العقد مكون من 5 صفحات.',
        comments: [
            { id: 1, lawyerId: 3, lawyerName: 'المحامية فاطمة', lawyerSpecialty: LawyerSpecialty.Family, text: 'يمكنني مراجعة العقد وتقديم استشارة كاملة خلال 24 ساعة.', cost: '75,000 دينار عراقي' }
        ],
        createdAt: new Date('2023-10-25T10:00:00Z').toISOString(),
    },
    {
        id: 2,
        clientId: 6,
        clientName: 'العميلة سارة',
        title: 'قضية نزاع عمالي',
        description: 'تم فصلي من العمل بشكل تعسفي وأرغب في رفع قضية على الشركة للمطالبة بحقوقي. أبحث عن محامي متخصص في القضايا العمالية.',
        comments: [],
        createdAt: new Date('2023-10-26T14:30:00Z').toISOString(),
    },
];

export const CHATS: Chat[] = [
    {
        id: 'client-5-lawyer-3',
        clientId: 5,
        lawyerId: 3,
        messages: [
            { id: 1, senderId: 5, text: 'مرحبا، بخصوص عرضك على منشوري', timestamp: new Date().toISOString() },
            { id: 2, senderId: 3, text: 'أهلاً بك، يسعدني مساعدتك. هل يمكنك إرسال نسخة من العقد؟', timestamp: new Date().toISOString() },
        ]
    }
];