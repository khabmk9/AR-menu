import { Link } from "react-router";
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Route } from "./+types/home";
import {
  Sparkles,
  Zap,
  QrCode,
  Smartphone,
  Globe,
  ArrowRight,
  Star,
  ChevronRight,
  UtensilsCrossed,
  Image as ImageIcon,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Hostel Menu Pakistan - Digital Menu for Pakistani Hostels" },
    {
      name: "description",
      content: "Create stunning digital menus for your hostel. QR codes, 3D views, custom dishes - all in PKR. Free to use!",
    },
  ];
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (heroRef.current) {
      const tl = gsap.timeline();

      tl.from('.hero-badge', {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
      })
        .from('.hero-title', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.3')
        .from('.hero-subtitle', {
          y: 30,
          opacity: 0,
          duration: 0.6,
        }, '-=0.4')
        .from('.hero-cta', {
          y: 20,
          opacity: 0,
          duration: 0.6,
        }, '-=0.3')
        .from('.hero-stat', {
          scale: 0.8,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        }, '-=0.3');
    }

    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%',
      },
      y: 60,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.step-card', {
      scrollTrigger: {
        trigger: '.steps-section',
        start: 'top 80%',
      },
      x: -50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out',
    });
  }, []);

  const features = [
    {
      icon: UtensilsCrossed,
      title: 'Digital Menu Builder',
      description: 'Apne hostel ka complete menu banayein - Nashta, Dopehar, Raat ka khana',
      featured: true,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Drag & Drop',
      description: 'Asaan interface - sirf drag karein aur menu banayein',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: QrCode,
      title: 'Free QR Codes',
      description: 'QR code generate karein, students scan karein, menu dekhein',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: ImageIcon,
      title: 'Apni Photos',
      description: 'Apne khane ki photos upload karein - real pictures',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Smartphone,
      title: '3D Preview',
      description: 'Interactive 3D view mein apna menu dekhein',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Globe,
      title: 'PKR Prices',
      description: 'Sari prices Pakistani Rupees mein - Rs. 50 se Rs. 500',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Hostel Setup Karein',
      description: 'Apne hostel ka naam, slogan aur logo add karein',
      icon: '🏨',
    },
    {
      number: 2,
      title: 'Menu Banayein',
      description: 'Khane ki items drag karein ya apni dishes upload karein',
      icon: '🍽️',
    },
    {
      number: 3,
      title: 'QR Code Share Karein',
      description: 'QR code print karein aur hostel mein lagayein',
      icon: '📱',
    },
  ];

  const testimonials = [
    {
      name: 'Ahmed Khan',
      role: 'Hostel Warden, Lahore',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      quote: 'Ab students sirf QR scan karke menu dekh lete hain. Bohat asaan ho gaya!',
      rating: 5,
    },
    {
      name: 'Muhammad Ali',
      role: 'Mess Manager, Karachi',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      quote: 'Menu update karna ab 2 minute ka kaam hai. Pehle print karana parta tha.',
      rating: 5,
    },
    {
      name: 'Fatima Bibi',
      role: 'Girls Hostel, Islamabad',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      quote: 'Larki students ko bohat pasand aaya. Modern aur stylish lagta hai!',
      rating: 5,
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 overflow-x-hidden">

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-slate-900 to-emerald-900/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <motion.div
            className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full backdrop-blur-sm mb-8"
          >
            <span className="text-xl">🇵🇰</span>
            <span className="text-sm font-medium bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent">
              Pakistan Ka Digital Menu System
            </span>
          </motion.div>

          <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
              Hostel Menu
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
              Pakistan 🇵🇰
            </span>
          </h1>

          <p className="hero-subtitle text-xl md:text-2xl text-green-200 mb-10 max-w-3xl mx-auto">
            Apne hostel ka digital menu banayein - sirf 5 minute mein.
            <br className="hidden md:block" />
            <span className="text-green-400 font-semibold">Free QR codes, 3D preview, aur apni photos!</span>
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/setup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/50 flex items-center gap-2 group"
              >
                Shuru Karein - Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/dashboard/ar-builder">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl flex items-center gap-2 group"
              >
                Demo Dekhein
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              { value: '500+', label: 'Hostels' },
              { value: '1M+', label: 'Menu Views' },
              { value: '100%', label: 'Free' },
            ].map((stat, i) => (
              <div key={i} className="hero-stat text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-green-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-green-400/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-green-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Features Jo Aapko Chahiye
            </h2>
            <p className="text-xl text-green-300">Sab kuch jo aapke hostel menu ke liye zaroori hai</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="feature-card group"
                  whileHover={{ y: -10 }}
                >
                  <div className={`relative bg-slate-900/50 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 h-full transition-all hover:border-green-500/40 overflow-hidden ${feature.featured ? 'ring-2 ring-green-500/50' : ''
                    }`}>
                    {feature.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                          POPULAR
                        </span>
                      </div>
                    )}

                    <div className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-xl mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-green-300 leading-relaxed">{feature.description}</p>

                    <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="steps-section relative py-24 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Kaise Kaam Karta Hai?</h2>
            <p className="text-xl text-green-300">Sirf 3 asaan steps mein shuru karein</p>
          </div>

          <div className="space-y-8">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                className="step-card flex flex-col md:flex-row items-center gap-8 bg-slate-900/50 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 hover:border-green-500/40 transition-all"
                whileHover={{ x: 10 }}
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-4xl">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-green-600">
                      {step.number}
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-lg text-green-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Hostel Wardens Kya Kehte Hain</h2>
            <p className="text-xl text-green-300">Hamare users ki baatein sunein</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 hover:border-green-500/40 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-green-200 mb-6 text-lg leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-green-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-12 backdrop-blur-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Apna Digital Menu Banayein! 🚀
            </h2>
            <p className="text-xl text-green-300 mb-8">
              100% Free - Koi payment nahi, koi card nahi
            </p>
            <Link to="/setup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-green-500/50 flex items-center gap-2 mx-auto group"
              >
                Abhi Shuru Karein
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <p className="text-green-400 text-sm mt-4">5 minute mein ready ✓</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-500/20 bg-slate-900/50 backdrop-blur-xl py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">🇵🇰</span>
                Hostel Menu
              </h3>
              <p className="text-green-300 text-sm">Ghar Jaisa Khana</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-green-300 text-sm">
                <li><Link to="/setup" className="hover:text-white transition-colors">Setup</Link></li>
                <li><Link to="/dashboard/ar-builder" className="hover:text-white transition-colors">Menu Builder</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-green-300 text-sm">
                <li>WhatsApp: +92 XXX XXXXXXX</li>
                <li>Email: info@hostelmenu.pk</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Cities</h3>
              <ul className="space-y-2 text-green-300 text-sm">
                <li>Lahore</li>
                <li>Karachi</li>
                <li>Islamabad</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-500/20 pt-8 text-center text-green-400 text-sm">
            © 2026 Hostel Menu Pakistan. Made with ❤️ in Pakistan
          </div>
        </div>
      </footer>
    </div>
  );
}
