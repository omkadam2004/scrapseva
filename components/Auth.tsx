
import React, { useState, useEffect } from 'react';
import {
  Recycle, ArrowRight, Lock, Mail, AlertCircle,
  Eye, EyeOff, Phone, Truck, ShieldCheck,
  MapPin, Briefcase, ChevronDown, CheckSquare, Square,
  Building, User as UserIcon, Bike, Info
} from 'lucide-react';
import { UserRole, Language, User as UserType, Theme, ScrapType } from '../types';
import { t } from '../utils/translations';

interface AuthProps {
  onLogin: (role: UserRole, name: string, email: string, extraData?: any) => void;
  language: Language;
  theme: Theme;
  registeredCollectors?: UserType[];
  onRegisterCollector?: (data: any) => void;
}
// ================= API HELPER =================
const API_BASE = "http://localhost:5000/api";

const apiRequest = async (url: string, data: any) => {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

const Auth: React.FC<AuthProps> = ({ onLogin, language, theme, registeredCollectors = [], onRegisterCollector }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('seller');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signupStep, setSignupStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    license: '',
    area: 'Downtown',
    businessName: '',
    experienceYears: 1,
    agreeToTerms: false
  });

  useEffect(() => {
    if (role === 'admin') {
      setIsLogin(true);
      setError(null);
    }
    // Reset signup step when role changes
    setSignupStep(1);
  }, [role]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      // ================= ADMIN LOGIN =================
      // ================= ADMIN LOGIN =================
      if (role === "admin") {
        // Hardcode your admin credentials here
        const adminEmail = "siddharthsalvi49@gmail.com"; // <-- replace with your email
        const adminPassword = "12345";     // <-- replace with your password

        const res = await apiRequest("/users/login", {
          email: adminEmail,
          password: adminPassword,
          role: "admin",
        });

        onLogin("admin", res.user.name, res.user.email, {
          token: res.token,
        });

        setFormData(prev => ({ ...prev, email: adminEmail, password: adminPassword })); // optional: fill form
        return;
      }

      // ================= COLLECTOR SIGNUP STEP 1 =================
      if (!isLogin && role === "collector" && signupStep === 1) {
        // Validate step 1 fields
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
          throw new Error("Please fill in all required fields.");
        }
        // Advance to step 2
        setIsLoading(false);
        setSignupStep(2);
        return;
      }

      // ================= COLLECTOR SIGNUP STEP 2 =================
      if (!isLogin && role === "collector" && signupStep === 2) {
        if (!formData.agreeToTerms) {
          throw new Error("Please agree to the terms.");
        }

        await apiRequest("/users/register", {
          role: "collector",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          businessName: formData.businessName,
          licenseNumber: formData.license,
          operationalArea: formData.area,
          experienceYears: formData.experienceYears,
        });

        setSuccessMsg("Registration submitted! Awaiting admin approval.");
        setTimeout(() => {
          setIsLogin(true);
          setSignupStep(1);
        }, 3000);
        return;
      }

      // ================= COLLECTOR LOGIN =================
      if (isLogin && role === "collector") {
        const res = await apiRequest("/users/login", {
          email: formData.email,
          password: formData.password,
          role: "collector",
        });

        if (!res.user.isVerified) {
          throw new Error("Account pending approval.");
        }

        onLogin("collector", res.user.name, res.user.email, {
          existingUser: res.user,
          token: res.token,
        });
        return;
      }

      // ================= SELLER SIGNUP =================
      if (!isLogin && role === "seller") {
        if (!formData.agreeToTerms) {
          throw new Error("You must agree to the Terms & Conditions.");
        }

        await apiRequest("/users/register", {
          role: "seller",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
        });


        setSuccessMsg("Account created successfully. Please login.");
        setTimeout(() => setIsLogin(true), 2000);
        return;
      }

      // ================= SELLER LOGIN =================
      if (isLogin && role === "seller") {
        const res = await apiRequest("/users/login", {
          email: formData.email,
          password: formData.password,
          role: "seller",
        });

        onLogin("seller", res.user.name, res.user.email, {
          phone: res.user.phone,
          address: res.user.address,
          token: res.token,
        });
        return;
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (error) setError(null);
    if (successMsg) setSuccessMsg(null);
  };

  const toggleMode = () => {
    if (role === 'admin') return;
    setIsLogin(!isLogin);
    setError(null);
    setSuccessMsg(null);
    setSignupStep(1);
    setFormData(prev => ({ ...prev, password: '', phone: '' }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-2 sm:p-6 transition-colors duration-300">
      <div className="max-w-6xl w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-0 lg:min-h-[720px] border border-zinc-200 dark:border-zinc-800">

        {/* Branding Side with Image */}
        <div className="lg:w-2/5 relative text-white p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={role === 'collector'
                ? "https://images.unsplash.com/photo-1605600611284-1952139d8823?auto=format&fit=crop&q=80&w=1200"
                : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200"}
              alt="Eco Recycling"
              className="w-full h-full object-cover transform scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-emerald-900/40"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                <Recycle size={28} className="text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-tight text-white">
                  Scrap<span className="font-serif-custom italic text-emerald-400">Seva</span>
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl sm:text-5xl font-serif-custom font-bold leading-tight drop-shadow-xl">
                {isLogin ? "Welcome back to service." : role === 'collector' ? "Build your Green Business." : "Start your eco journey today."}
              </h2>
              <p className="text-emerald-100/70 text-base sm:text-lg leading-relaxed max-w-sm font-light">
                {role === 'seller' ? "Turn household waste into ecological value." : "Professional logistics for the modern recycling industry."}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12 lg:mt-0">
            <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2rem] shadow-inner">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="text-emerald-400" />
                <p className="text-[10px] text-emerald-200/60 uppercase font-bold tracking-widest">Verified Network</p>
              </div>
              <p className="text-sm font-medium text-white/90">Our collectors are fully certified to handle hazardous and recyclable materials with maximum efficiency.</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:w-3/5 bg-white dark:bg-zinc-900 flex flex-col relative p-6 sm:p-16 overflow-y-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {isLogin ? t('signIn', language) : t('createAccount', language)}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                {isLogin ? "Credentials for your eco-portal." : role === 'collector' ? "Onboarding step " + signupStep + " of 2" : "Join our sustainable ecosystem."}
              </p>
            </div>
            {role !== 'admin' && (
              <button onClick={toggleMode} className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl transition-all">
                {isLogin ? "Join ScrapSeva" : "Login Instead"}
              </button>
            )}
          </div>

          <div className="mb-10 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl flex">
            {(['seller', 'collector', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`
                            flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all
                            ${role === r
                    ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-300 shadow-lg'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}
                        `}
              >
                {r === 'collector' ? <Truck size={14} /> : r === 'admin' ? <ShieldCheck size={14} /> : <UserIcon size={14} />}
                <span className="capitalize">{t(r, language)}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* LOGIN MODE or STEP 1 OF SIGNUP */}
            {(isLogin || signupStep === 1) && (
              <div className="space-y-5 animate-in fade-in duration-500">
                {!isLogin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('fullName', language)}</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                          type="text" name="name" required
                          className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-700 focus:border-emerald-500 rounded-2xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none transition-all shadow-sm"
                          placeholder="E.g. Rajesh Kumar" onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('phoneNumber', language)}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                          type="tel" name="phone" required
                          className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-700 focus:border-emerald-500 rounded-2xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none transition-all shadow-sm"
                          placeholder="+91 99..." onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('email', language)}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type="email" name="email" required
                      className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-700 focus:border-emerald-500 rounded-2xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none transition-all shadow-sm"
                      placeholder="name@email.com" onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">{t('password', language)}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type={showPassword ? "text" : "password"} name="password" required
                      className="w-full pl-11 pr-12 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-700 focus:border-emerald-500 rounded-2xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none transition-all shadow-sm"
                      placeholder="••••••••" value={formData.password} onChange={handleInputChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-5 flex items-center text-zinc-400">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {!isLogin && role === 'seller' && (
                  <div className="pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox" name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded-lg border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 transition-colors">
                        I agree to the <button type="button" className="font-bold text-emerald-600 underline">Terms of Service</button> and Privacy Policy.
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* COLLECTOR SPECIFIC SIGNUP STEP 2 */}
            {!isLogin && role === 'collector' && signupStep === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Business/Shop Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="text" name="businessName" required
                        className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-700 focus:border-emerald-500 rounded-2xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none transition-all shadow-sm"
                        placeholder="E.g. Om Recycling Services" onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Service Area</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <select
                        name="area"
                        className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-700 focus:border-emerald-500 rounded-2xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none transition-all shadow-sm appearance-none cursor-pointer"
                        onChange={handleInputChange}
                      >
                        <option value="Downtown">Downtown Area</option>
                        <option value="Suburbs">Suburban Sector</option>
                        <option value="Industrial">Industrial Zone</option>
                        <option value="Residency">Residential Gated Communities</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">License/ID Number</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="text" name="license" required
                        className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-700 focus:border-emerald-500 rounded-2xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none transition-all shadow-sm"
                        placeholder="DL/Govt ID: MH12-XXXX" onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Experience (Years)</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="number" name="experienceYears" required min="0"
                        className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-700 focus:border-emerald-500 rounded-2xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none transition-all shadow-sm"
                        placeholder="E.g. 5" onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex gap-3">
                  <Info size={20} className="text-amber-500 shrink-0" />
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-tight">
                    By submitting, you agree to our Collector Standards which include transparent weighing and fair payout rates as per market benchmarks.
                  </p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox" name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded-lg border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 transition-colors">
                    I confirm my business details are accurate.
                  </span>
                </label>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold animate-pulse">
                <AlertCircle className="shrink-0" size={16} /> {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <ShieldCheck className="shrink-0 text-emerald-500" size={20} /> {successMsg}
              </div>
            )}

            <div className="flex gap-4">
              {!isLogin && role === 'collector' && signupStep === 2 && (
                <button
                  type="button"
                  onClick={() => setSignupStep(1)}
                  className="w-1/3 py-5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-200 transition-all"
                >
                  Back
                </button>
              )}
              <button
                type="submit" disabled={isLoading}
                className={`py-5 px-6 rounded-2xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ${!isLogin && role === 'collector' && signupStep === 2 ? 'w-2/3' : 'w-full'}`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isLogin ? "Access Portal" : (role === 'collector' && signupStep === 1 ? "Next Details" : "Apply for Onboarding")}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-auto pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400">© 2024 ScrapSeva India • All Rights Reserved</p>
            <div className="flex gap-6">
              <button className="text-[10px] font-bold text-zinc-500 hover:text-emerald-600 uppercase tracking-widest transition-colors">Safety</button>
              <button className="text-[10px] font-bold text-zinc-500 hover:text-emerald-600 uppercase tracking-widest transition-colors">Support</button>
              <button className="text-[10px] font-bold text-zinc-500 hover:text-emerald-600 uppercase tracking-widest transition-colors">Legal</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
