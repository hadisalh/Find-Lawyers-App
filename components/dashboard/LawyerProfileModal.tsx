import React, { useState } from 'react';
import { Lawyer, User, UserRole } from '../../types';
import { AtSymbolIcon, PhoneIcon, BriefcaseIcon, UserIcon, ScaleIcon, StarIcon } from '../ui/icons';

interface LawyerProfileModalProps {
  lawyer: Lawyer;
  onClose: () => void;
  currentUser: User;
  onRateLawyer?: (lawyerId: number, rating: number, review: string) => void;
}

export const LawyerProfileModal: React.FC<LawyerProfileModalProps> = ({ lawyer, onClose, currentUser, onRateLawyer }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const isClientViewing = currentUser.role === UserRole.Client;

  const handleRatingSubmit = () => {
    if (rating > 0 && onRateLawyer) {
      onRateLawyer(lawyer.id, rating, review);
    } else {
      alert('يرجى اختيار تقييم (عدد النجوم) على الأقل.');
    }
  };

  const InfoRow: React.FC<{icon: React.ReactNode; label: string; value: string | number}> = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 p-3">
        <div className="text-slate-500 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <p className="text-md font-bold text-slate-800">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
                <UserIcon className="w-6 h-6 text-blue-600"/>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{lawyer.fullName}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light" aria-label="Close">&times;</button>
        </header>
        <main className="p-6">
            <div className="grid grid-cols-2 gap-2">
                <InfoRow icon={<BriefcaseIcon className="w-5 h-5"/>} label="التخصص" value={lawyer.specialty} />
                <InfoRow icon={<ScaleIcon className="w-5 h-5"/>} label="القضايا الرابحة" value={lawyer.wonCases} />
                <InfoRow icon={<AtSymbolIcon className="w-5 h-5"/>} label="البريد الإلكتروني" value={lawyer.email} />
                <InfoRow icon={<PhoneIcon className="w-5 h-5"/>} label="رقم الهاتف" value={lawyer.phone} />
            </div>
             <div className="pt-4">
                <h3 className="font-bold text-slate-700 mb-2 px-3">التقييمات</h3>
                <div className="max-h-24 overflow-y-auto bg-slate-50 rounded-lg p-2 space-y-2">
                    {lawyer.reviews.length > 0 ? lawyer.reviews.map((review, index) => (
                        <p key={index} className="text-sm text-slate-800 p-2 bg-white rounded shadow-sm">"{review}"</p>
                    )) : <p className="text-sm text-center text-slate-500 p-2">لا توجد تقييمات بعد.</p>}
                </div>
            </div>
        </main>

        {isClientViewing && onRateLawyer && (
            <div className="p-6 border-t bg-slate-50 rounded-b-2xl">
                <h3 className="text-lg font-bold text-gray-800 mb-3">أضف تقييمك</h3>
                <div className="flex justify-center items-center mb-4" onMouseLeave={() => setHoverRating(0)}>
                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                            <StarIcon 
                                key={starValue}
                                className={`w-8 h-8 cursor-pointer transition-colors ${starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHoverRating(starValue)}
                                filled={starValue <= (hoverRating || rating)}
                            />
                        )
                    })}
                </div>
                <textarea 
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="اكتب مراجعتك هنا (اختياري)..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={2}
                />
                <button 
                    onClick={handleRatingSubmit}
                    className="w-full mt-3 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    إرسال التقييم
                </button>
            </div>
        )}
      </div>
    </div>
  );
};