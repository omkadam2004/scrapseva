import React, { useState } from 'react';
import { User, Save, MapPin, Mail, Phone, Shield, BadgeCheck } from 'lucide-react';
import { User as UserType, Language } from '../types';
import { t } from '../utils/translations';

interface UserProfileProps {
  user: UserType;
  onUpdate: (updatedUser: Partial<UserType>) => void;
  language: Language;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, language }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    address: user.address || '',
    phone: user.phone || '',
    operationalArea: user.operationalArea || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white">
              <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                      {user.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover"/> : user.name.charAt(0)}
                  </div>
                  <div>
                      <h1 className="text-2xl font-bold flex items-center gap-2">
                          {user.name} 
                          {user.isVerified && <BadgeCheck className="text-blue-400" size={24} />}
                      </h1>
                      <p className="text-slate-300 flex items-center gap-2 capitalize">
                          {t(user.role as any, language)} • {user.email}
                      </p>
                      <div className="mt-3 flex gap-2">
                          {user.role === 'collector' && user.licenseNumber && (
                              <span className="bg-amber-500/20 border border-amber-500/50 px-2 py-0.5 rounded text-xs text-amber-200">
                                  {t('licenseNumber', language)}: {user.licenseNumber}
                              </span>
                          )}
                      </div>
                  </div>
              </div>
          </div>

          {/* Form */}
          <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-slate-800">{t('profileDetails', language)}</h2>
                  {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                      >
                          {t('editProfile', language)}
                      </button>
                  )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t('fullName', language)}</label>
                          <div className="relative">
                              <User className="absolute left-3 top-3 text-slate-400" size={18} />
                              <input 
                                  type="text" 
                                  value={formData.name}
                                  disabled={!isEditing}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t('email', language)}</label>
                          <div className="relative">
                              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                              <input 
                                  type="email" 
                                  value={formData.email}
                                  disabled={true} // Email usually locked
                                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t('phoneNumber', language)}</label>
                          <div className="relative">
                              <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                              <input 
                                  type="tel" 
                                  value={formData.phone}
                                  disabled={!isEditing}
                                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                  placeholder="+1 234 567 890"
                                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                              />
                          </div>
                      </div>

                      {user.role === 'seller' && (
                           <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t('defaultAddress', language)}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={formData.address}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                                    />
                                </div>
                           </div>
                      )}

                      {user.role === 'collector' && (
                           <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{t('operationalArea', language)}</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <select
                                        value={formData.operationalArea}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({...formData, operationalArea: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 bg-white"
                                    >
                                        <option value="Downtown">Downtown</option>
                                        <option value="Suburbs">Suburbs</option>
                                        <option value="Industrial Park">Industrial Park</option>
                                    </select>
                                </div>
                           </div>
                      )}
                  </div>

                  {isEditing && (
                      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                          <button 
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    name: user.name,
                                    email: user.email,
                                    address: user.address || '',
                                    phone: user.phone || '',
                                    operationalArea: user.operationalArea || ''
                                });
                            }}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                              {t('cancel', language)}
                          </button>
                          <button 
                            type="submit"
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2"
                          >
                              <Save size={18} /> {t('saveChanges', language)}
                          </button>
                      </div>
                  )}
              </form>
          </div>
       </div>
    </div>
  );
};

export default UserProfile;