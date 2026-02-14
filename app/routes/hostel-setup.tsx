import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import {
    Upload,
    Building2,
    Image as ImageIcon,
    Type,
    Check,
    ArrowRight,
    Sparkles,
} from 'lucide-react';

interface HostelProfile {
    name: string;
    slogan: string;
    logo: string | null;
    createdAt: string;
}

export default function HostelSetup() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [hostelName, setHostelName] = useState('');
    const [slogan, setSlogan] = useState('');
    const [logo, setLogo] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Load existing profile if available
    useEffect(() => {
        const savedProfile = localStorage.getItem('hostel-profile');
        if (savedProfile) {
            const profile: HostelProfile = JSON.parse(savedProfile);
            setHostelName(profile.name);
            setSlogan(profile.slogan);
            setLogo(profile.logo);
        }
    }, []);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setLogo(event.target?.result as string);
                toast.success('Logo uploaded!', { icon: '🖼️' });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        if (!hostelName.trim()) {
            toast.error('Please enter your hostel name');
            return;
        }

        setIsLoading(true);

        const profile: HostelProfile = {
            name: hostelName,
            slogan: slogan || 'Ghar Jaisa Khana',
            logo: logo,
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem('hostel-profile', JSON.stringify(profile));

        setTimeout(() => {
            setIsLoading(false);
            toast.success('Profile saved! Redirecting to menu builder...', { icon: '✅' });
            setTimeout(() => {
                navigate('/dashboard/ar-builder');
            }, 1000);
        }, 1500);
    };

    const nextStep = () => {
        if (step === 1 && !hostelName.trim()) {
            toast.error('Please enter your hostel name');
            return;
        }
        setStep(step + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
            <Toaster position="top-center" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-white/10 rounded-full mb-4 border border-green-500/30"
                    >
                        <span className="text-xl">🇵🇰</span>
                        <span className="text-green-300 font-medium">Hostel Menu Pakistan</span>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">Setup Your Hostel</h1>
                    <p className="text-purple-300">Create your digital menu in minutes</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                        : 'bg-slate-800 text-slate-500'
                                    }`}
                            >
                                {step > s ? <Check size={20} /> : s}
                            </div>
                            {s < 3 && (
                                <div className={`w-12 h-1 mx-2 rounded ${step > s ? 'bg-green-500' : 'bg-slate-700'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <motion.div
                    layout
                    className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8"
                >
                    {/* Step 1: Hostel Name */}
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Building2 className="w-8 h-8 text-green-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-1">Hostel Name</h2>
                                <p className="text-purple-300 text-sm">What is your hostel called?</p>
                            </div>

                            <input
                                type="text"
                                value={hostelName}
                                onChange={(e) => setHostelName(e.target.value)}
                                placeholder="e.g., Boys Hostel Block A"
                                className="w-full px-4 py-4 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-all text-lg"
                            />

                            <button
                                onClick={nextStep}
                                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
                            >
                                Next
                                <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Slogan */}
                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Type className="w-8 h-8 text-purple-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-1">Slogan (Optional)</h2>
                                <p className="text-purple-300 text-sm">Add a catchy tagline</p>
                            </div>

                            <input
                                type="text"
                                value={slogan}
                                onChange={(e) => setSlogan(e.target.value)}
                                placeholder="e.g., Ghar Jaisa Khana"
                                className="w-full px-4 py-4 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all text-lg"
                            />

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    Next
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Logo Upload */}
                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <ImageIcon className="w-8 h-8 text-pink-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-1">Logo (Optional)</h2>
                                <p className="text-purple-300 text-sm">Upload your hostel logo</p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />

                            {logo ? (
                                <div className="relative">
                                    <img
                                        src={logo}
                                        alt="Hostel Logo"
                                        className="w-32 h-32 rounded-2xl object-cover mx-auto border-4 border-green-500/50"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white text-sm hover:bg-slate-700 transition-all"
                                    >
                                        Change
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-12 border-2 border-dashed border-purple-500/30 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
                                >
                                    <Upload className="w-10 h-10 text-purple-400" />
                                    <span className="text-purple-300">Click to upload logo</span>
                                    <span className="text-slate-500 text-sm">PNG, JPG up to 5MB</span>
                                </button>
                            )}

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={20} />
                                            Create Menu
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Preview Card */}
                {(hostelName || logo) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/20"
                    >
                        <p className="text-purple-300 text-xs mb-3">Preview</p>
                        <div className="flex items-center gap-3">
                            {logo ? (
                                <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                            ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <span className="text-xl">🇵🇰</span>
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-white">{hostelName || 'Your Hostel Name'}</h3>
                                <p className="text-purple-300 text-sm">{slogan || 'Ghar Jaisa Khana'}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Skip Button */}
                <button
                    onClick={() => navigate('/dashboard/ar-builder')}
                    className="w-full mt-4 text-center text-purple-400 hover:text-purple-300 text-sm transition-all"
                >
                    Skip for now →
                </button>
            </motion.div>
        </div>
    );
}
