import React, { useState } from 'react';
import { Lawyer, User, UserRole } from '../../types';
import { StarIcon, UserIcon, AtSymbolIcon, PhoneIcon } from '../ui/icons';

interface LawyerProfileModalProps {
  lawyer: Lawyer;
  onClose: () => void;
  currentUser: User;
  onRateLawyer: (lawyerId: number, rating: number, review: string) => void;
}

export const LawyerProfileModal: React.FC<LawyerProfileModalProps> = ({ lawyer, onClose, currentUser, onRateLawyer }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const handleRatingSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating from 1 to 5 stars.');
      return;
    }
    onRateLawyer(lawyer.id, rating, review);
  };
  
  const canRate = currentUser.role === UserRole.Client;
  const isAdminViewer = currentUser.role === UserRole.Admin;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">ملف المحامي الشخصي</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light" aria-label="Close">&times;</button>
        </header>

        <main className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                <div className="bg-slate-100 p-6 rounded-full">
                    <UserIcon className="w-16 h-16 text-slate-500" />
                </div>
                <div className="text-center sm:text-right">
                    <h3 className="text-2xl font-extrabold text-slate-900">{lawyer.fullName}</h3>
                    <p className="text-lg font-semibold text-emerald-600">{lawyer.specialty}</p>
                    <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                        <div className="flex text-yellow-400">
                           {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5" filled={i < lawyer.rating} />)}
                        </div>
                        <span className="text-slate-600 font-bold">({lawyer.rating.toFixed(1)})</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-600">{lawyer.numberOfRatings} تقييم</span>
                    </div>
                </div>
                <div className="sm:ml-auto text-center sm:text-right bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">القضايا الرابحة</p>
                    <p className="text-3xl font-bold text-blue-900">{lawyer.wonCases}</p>
                </div>
            </div>

            <div className="space-y-6">
                 {isAdminViewer && (
                    <div>
                        <h4 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">معلومات الاتصال</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
                                <AtSymbolIcon className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-600">البريد الإلكتروني</p>
                                    <p className="font-bold text-slate-800">{lawyer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
                                <PhoneIcon className="w-5 h-5 text-slate-500" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-600">رقم الهاتف</p>
                                    <p className="font-bold text-slate-800">{lawyer.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <div>
                    <h4 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">آراء العملاء</h4>
                    {lawyer.reviews && lawyer.reviews.length > 0 ? (
                        <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {lawyer.reviews.map((rev, index) => (
                                <div key={index} className="bg-slate-100 p-3 rounded-lg">
                                    <p className="text-slate-700">"{rev}"</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500">لا توجد آراء حتى الآن.</p>
                    )}
                </div>

                {/* Rating Form */}
                {canRate && (
                    <div>
                        <h4 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">أضف تقييمك</h4>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex justify-center mb-4 text-gray-300">
                                {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <StarIcon
                                    key={starValue}
                                    className={`w-10 h-10 cursor-pointer transition-colors ${ (hoverRating || rating) >= starValue ? 'text-yellow-400' : ''}`}
                                    onClick={() => setRating(starValue)}
                                    onMouseEnter={() => setHoverRating(starValue)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    filled={(hoverRating || rating) >= starValue}
                                    />
                                );
                                })}
                            </div>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="اكتب رأيك هنا (اختياري)..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                                rows={3}
                            ></textarea>
                            <button 
                                onClick={handleRatingSubmit} 
                                className="mt-4 w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition-transform transform hover:scale-105"
                            >
                                إرسال التقييم
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
      </div>
    </div>
  );
};