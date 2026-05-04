import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Briefcase, Users, ShieldCheck, Zap, Sparkles, Star, ChevronDown, Play, MousePointer2 } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-charcoal-800 font-sans selection:bg-charcoal-800 selection:text-pearl-200 overflow-hidden">
      
      {/* Navbar Overlay */}
      <nav className="absolute top-0 w-full z-50 px-6 py-10 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <Link to="/" className="text-3xl font-nexed font-black tracking-tighter flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-charcoal-gradient flex items-center justify-center text-pearl-100 shadow-charcoal group-hover:rotate-12 transition-transform duration-500">
            <Sparkles size={24} fill="currentColor" />
          </div>
          <span className="charcoal-text-gradient">Jobsy</span>
        </Link>
        
        <div className="hidden lg:flex gap-12 font-nexed font-black text-[10px] uppercase tracking-[0.3em] text-charcoal-500">
          <a href="#vision" className="hover:text-charcoal-800 transition-colors">Vision</a>
          <a href="#network" className="hover:text-charcoal-800 transition-colors">Network</a>
          <a href="#intelligence" className="hover:text-charcoal-800 transition-colors">Intelligence</a>
        </div>

        <div className="flex gap-8 items-center">
          <Link to="/login" className="text-[10px] font-nexed font-black uppercase tracking-[0.2em] text-charcoal-400 hover:text-charcoal-800 transition-colors">Log In</Link>
          <Link to="/register" className="bg-charcoal-gradient text-pearl-100 px-8 py-4 rounded-2xl text-[10px] font-nexed font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-charcoal hover:-translate-y-1">
            Apply Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-60 pb-32 lg:pt-80 lg:pb-48 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] bg-charcoal-800/5 rounded-full blur-[150px] animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center z-10 relative">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border border-charcoal-100 text-charcoal-800 font-nexed font-black text-[10px] uppercase tracking-[0.3em] mb-12 fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-charcoal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-charcoal-800"></span>
            </span>
            The 2026 Elite Talent Protocol
          </div>
          <h1 className="text-7xl md:text-9xl font-nexed font-bold tracking-tight text-charcoal-900 mb-10 leading-[0.95] fade-in-up">
            Design Your <br className="hidden md:block"/>
            <span className="charcoal-text-gradient italic">Legacy.</span>
          </h1>
          <p className="text-xl md:text-2xl text-charcoal-500 mb-16 max-w-3xl mx-auto fade-in-up font-light leading-relaxed italic" style={{ animationDelay: '0.1s' }}>
            Where strategic institutions meet the world's most exceptional talent. Experience the zenith of professional networking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
             <Link to="/register" className="w-full sm:w-auto bg-charcoal-gradient text-pearl-100 px-12 py-6 rounded-[2rem] font-nexed font-black uppercase tracking-[0.2em] text-xs shadow-charcoal hover:scale-105 transition-all flex items-center justify-center gap-4 group">
                Initiate Application <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Link>
             <button className="w-full sm:w-auto glass border border-charcoal-100 text-charcoal-800 px-12 py-6 rounded-[2rem] font-nexed font-black uppercase tracking-[0.2em] text-xs hover:bg-charcoal-50 transition-all flex items-center justify-center gap-4">
                Watch Vision <Play size={18} />
             </button>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-[10px] font-nexed font-black uppercase tracking-[0.2em] text-charcoal-400 fade-in-up" style={{ animationDelay: '0.3s' }}>
             <span className="text-charcoal-800/50">Trusted By:</span>
             <span className="hover:text-charcoal-800 cursor-default transition-colors">Neural Dynamics</span>
             <span className="hover:text-charcoal-800 cursor-default transition-colors">Onyx Group</span>
             <span className="hover:text-charcoal-800 cursor-default transition-colors">Atlas Ventures</span>
             <span className="hover:text-charcoal-800 cursor-default transition-colors">Stellar Labs</span>
          </div>
        </div>
      </section>

      {/* Cinematic Commercial Section */}
      <section className="py-40 px-6 relative overflow-hidden bg-white">
         <div className="absolute inset-0 bg-charcoal-gradient opacity-[0.02]"></div>
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
               <div className="absolute inset-0 bg-charcoal-gradient rounded-[3rem] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-1000"></div>
               <div className="relative rounded-[3rem] border border-charcoal-100 overflow-hidden shadow-2xl glass">
                  <img 
                    src="/coffee_bean_milk_splash_premium_1777892595680.png" 
                    alt="Premium Experience" 
                    className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                     <p className="text-[10px] font-nexed font-black text-charcoal-800 uppercase tracking-[0.4em] mb-2">Cinematic Excellence</p>
                     <h3 className="text-3xl font-nexed font-bold text-charcoal-900 tracking-tight leading-none">The Artisan Approach</h3>
                  </div>
               </div>
            </div>
            <div className="space-y-12">
               <div>
                  <h2 className="text-5xl md:text-7xl font-nexed font-bold text-charcoal-900 leading-none mb-8">
                     Precision <br />
                     <span className="charcoal-text-gradient italic">Refined.</span>
                  </h2>
                  <p className="text-xl text-charcoal-500 font-light leading-relaxed italic">
                     Like a perfectly roasted bean splitting to reveal a dynamic flow of opportunity, Jobsy distills complex networking into a pure, potent experience.
                  </p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="p-8 glass rounded-[2rem] border border-pearl-900/10">
                     <p className="text-pearl-600 text-sm font-light leading-relaxed">Eliminating the noise to focus on what truly matters: your next strategic move.</p>
                  </div>
                  <div className="p-8 glass rounded-[2rem] border border-pearl-900/10">
                     <h4 className="text-white font-bold mb-2">Potent Flow</h4>
                     <p className="text-pearl-600 text-sm font-light leading-relaxed">A seamless trajectory from discovery to placement with cinematic fluidty.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Feature Grids */}
      <section className="py-40 px-6 relative z-10" id="network">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: Briefcase, title: 'Elite Mandates', desc: 'Curated roles from global powerhouses, accessible only to the verified elite.' },
            { icon: Users, title: 'Synergetic Network', desc: 'Collaborate with industry titans and visionary architects across the globe.', gold: true },
            { icon: ShieldCheck, title: 'Absolute Security', desc: 'Bank-grade protocols ensuring your professional assets remain untouchable.' }
          ].map((item, i) => (
            <div key={i} className={`glass border p-12 rounded-[3rem] hover:-translate-y-4 transition-all duration-700 group relative overflow-hidden ${item.gold ? 'border-gold-500/30' : 'border-pearl-900/10 hover:border-gold-500/20'}`}>
              {item.gold && <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-3xl rounded-full"></div>}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-2xl transition-all duration-500 ${item.gold ? 'bg-gold-500 text-onyx-900 shadow-gold group-hover:rotate-12' : 'bg-onyx-800 text-gold-500 border border-pearl-900/10'}`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-6 text-white">{item.title}</h3>
              <p className="text-pearl-500 text-lg leading-relaxed font-light italic">"{item.desc}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Board */}
      <section className="py-32 border-y border-pearl-900/10 bg-onyx-950/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
          {[
            { val: '99.9%', label: 'Placement Success' },
            { val: '48hr', label: 'Response Protocol' },
            { val: '250+', label: 'Global Institutions' },
            { val: '$120M', label: 'Talent Wealth' }
          ].map((stat, i) => (
            <div key={i} className="group">
              <div className="text-5xl md:text-6xl font-serif font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-500">{stat.val}</div>
              <div className="text-gold-500/50 uppercase tracking-[0.4em] text-[9px] font-black">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-60 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-onyx-950"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gold-500/10 rounded-full blur-[200px] animate-pulse"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-serif font-bold text-white mb-10 leading-none">Your Future <br /> <span className="gold-text-gradient italic">Starts Here.</span></h2>
          <p className="text-2xl text-pearl-600 mb-20 max-w-2xl mx-auto font-light italic">Admission is selective. The potential is infinite. Reserve your place in the registry.</p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link to="/register" className="bg-gold-gradient text-onyx-900 px-14 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-gold">
              Apply for Access
            </Link>
            <Link to="/login" className="glass text-white px-14 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-white/5 border border-pearl-900/20 transition-all">
              Enterprise Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-onyx-900 pt-40 pb-16 px-6 border-t border-pearl-900/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
          <div className="col-span-1 md:col-span-1">
            <div className="text-4xl font-serif font-black tracking-tighter flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-onyx-800 border border-pearl-900/20 flex items-center justify-center text-gold-500 shadow-2xl">
                <Sparkles size={24} fill="currentColor" />
              </div>
              <span className="gold-text-gradient">Jobsy</span>
            </div>
            <p className="text-pearl-700 mb-10 max-w-xs font-light leading-relaxed italic">Redefining professional excellence through cinematic design and strategic intelligence.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-10 uppercase tracking-[0.3em] text-[10px]">Verticals</h4>
            <ul className="space-y-6 text-pearl-700 font-bold text-[10px] uppercase tracking-widest">
              <li><a href="/#" className="hover:text-gold-500 transition-colors">Talent Pool</a></li>
              <li><a href="/#" className="hover:text-gold-500 transition-colors">Institutions</a></li>
              <li><a href="/#" className="hover:text-gold-500 transition-colors">Advisory</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-10 uppercase tracking-[0.3em] text-[10px]">Ecosystem</h4>
            <ul className="space-y-6 text-pearl-700 font-bold text-[10px] uppercase tracking-widest">
              <li><a href="/#" className="hover:text-gold-500 transition-colors">Intelligence</a></li>
              <li><a href="/#" className="hover:text-gold-500 transition-colors">Networks</a></li>
              <li><a href="/#" className="hover:text-gold-500 transition-colors">Governance</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-10 uppercase tracking-[0.3em] text-[10px]">Protocols</h4>
            <ul className="space-y-6 text-pearl-700 font-bold text-[10px] uppercase tracking-widest">
              <li><a href="/#" className="hover:text-gold-500 transition-colors">Security</a></li>
              <li><a href="/#" className="hover:text-gold-500 transition-colors">Privacy</a></li>
              <li><a href="/#" className="hover:text-gold-500 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 border-t border-pearl-900/5 flex flex-col md:flex-row justify-between items-center gap-8 text-pearl-800 text-[9px] font-black uppercase tracking-[0.5em]">
          <p>&copy; {new Date().getFullYear()} JOBSY ELITE OPERATIONS. EST. 2026.</p>
          <div className="flex gap-12">
            <a href="/#" className="hover:text-gold-500 transition-colors">Legal Protocol</a>
            <a href="/#" className="hover:text-gold-500 transition-colors">Privacy Shield</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
