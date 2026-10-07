import React, { useState } from 'react';
import { MessageSquare, Send, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { Language, UserRole } from '../types';

interface FeedbackFormProps {
  onBack: () => void;
  language: Language;
  userName: string;
  userRole: UserRole;
  onSubmit?: (data: { rating: number; category: string; comment: string }) => Promise<void>;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onBack, language, userName, userRole, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('service');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ratings = [
    { value: 1, label: 'Poor', emoji: '😞', activeClass: 'bg-red-50 dark:bg-red-950/30 border-red-500 text-red-600 dark:text-red-400', inactiveClass: 'text-slate-400 dark:text-slate-600 border-transparent bg-slate-100 dark:bg-slate-800' },
    { value: 2, label: 'Fair', emoji: '😐', activeClass: 'bg-orange-50 dark:bg-orange-950/30 border-orange-500 text-orange-600 dark:text-orange-400', inactiveClass: 'text-slate-400 dark:text-slate-600 border-transparent bg-slate-100 dark:bg-slate-800' },
    { value: 3, label: 'Good', emoji: '😊', activeClass: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-500 text-yellow-600 dark:text-yellow-400', inactiveClass: 'text-slate-400 dark:text-slate-600 border-transparent bg-slate-100 dark:bg-slate-800' },
    { value: 4, label: 'Great', emoji: '🤩', activeClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-600 dark:text-emerald-400', inactiveClass: 'text-slate-400 dark:text-slate-600 border-transparent bg-slate-100 dark:bg-slate-800' },
    { value: 5, label: 'Excellent', emoji: '💎', activeClass: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-600 dark:text-indigo-400', inactiveClass: 'text-slate-400 dark:text-slate-600 border-transparent bg-slate-100 dark:bg-slate-800' },
  ];

  const categories = [
    { id: 'service', label: 'Service Quality' },
    { id: 'pricing', label: 'Offer Rates' },
    { id: 'app', label: 'Platform Experience' },
    { id: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        // Use the callback if provided
        await onSubmit({ rating, category, comment });
      } else {
        // Send feedback to backend API WITHOUT _id
        const feedback = {
          rating,
          category,
          comment,
          userName,
          userRole,
          date: new Date().toISOString(),
        };
        await axios.post('http://localhost:5000/api/feedback', feedback);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error('❌ Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-12 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center border border-slate-100 dark:border-slate-800 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Feedback Saved</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm">
            Thank you for helping us optimize the ScrapSeva ecosystem.
          </p>
          <button onClick={onBack} className="px-10 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all active:scale-95">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 px-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Experience Feedback</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Share your thoughts to help us grow.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm theme-transition">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Ratings */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Overall Satisfaction</label>
            <div className="grid grid-cols-5 gap-2">
              {ratings.map(r => {
                const isSelected = rating === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRating(r.value)}
                    className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-3xl border-2 transition-all duration-300 transform ${isSelected ? `${r.activeClass} scale-105 shadow-md` : `${r.inactiveClass} hover:border-slate-200 dark:hover:border-slate-700`}`}
                  >
                    <span className={`text-2xl sm:text-3xl transition-transform ${isSelected ? 'scale-110' : 'grayscale-[0.8] opacity-60'}`}>{r.emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter truncate w-full text-center">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Focus Area</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${category === cat.id ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Detailed Input</label>
            <div className="relative">
              <MessageSquare className="absolute left-5 top-5 text-slate-400" size={18} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your experience?"
                required
                className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[140px] outline-none transition-all resize-none shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className="w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/10 disabled:opacity-30 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Feedback</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
