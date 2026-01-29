
import React, { useEffect, useState, useRef } from 'react';
import { 
  Github, 
  Send, 
  Mail, 
  Zap,
  Lock,
  Layers,
  Terminal,
  Globe,
  Menu,
  X,
  ExternalLink,
  Code2,
  ChevronRight,
  Monitor
} from 'lucide-react';

type Lang = 'en' | 'uk' | 'ru';

interface LocalizedContent {
  roles: string[];
  location: string;
  about: string;
  hero_title: string;
  hero_desc: string;
  hero_focus: string;
  nav: string[];
  sections: {
    experience: string;
    projects: string;
    stack: string;
    languages: string;
    cta_title: string;
  };
  specialization: { title: string; desc: string }[];
  experience: { 
    company: string; 
    role: string; 
    period: string; 
    details: string[];
  }[];
  projects: {
    company: string;
    name: string;
    desc: string;
    tech: string;
  }[];
  lang_levels: { name: string; level: string }[];
  seo: { title: string; description: string };
}

interface ProfileData {
  name: string;
  contacts: { 
    phone: { display: string; url: string };
    email: { display: string; url: string };
    telegram: { display: string; url: string };
    github: { display: string; url: string };
  };
  techStack: Record<string, string[]>;
  i18n: Record<Lang, LocalizedContent>;
}

const InteractivePhoto = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCoords({ x, y });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCoords({ x: 0, y: 0 });
      }}
      className="relative w-full aspect-square max-w-[500px] mx-auto lg:mx-0 group cursor-none interactive"
      style={{
        perspective: '1000px'
      }}
    >
      <div 
        className="relative w-full h-full transition-transform duration-200 ease-out preserve-3d"
        style={{
          transform: isHovering 
            ? `rotateX(${coords.y * -20}deg) rotateY(${coords.x * 20}deg) scale(1.05)` 
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-white/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Photo Container */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop" 
            alt="Nazar Kuzenko"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Floating Elements for 3D depth */}
        <div 
          className="absolute -top-4 -right-4 bg-white text-black mono text-[10px] font-bold px-4 py-2 rounded-full shadow-xl transition-transform duration-300"
          style={{ transform: `translateZ(50px) translateX(${coords.x * 30}px) translateY(${coords.y * 30}px)` }}
        >
          SENIOR LEAD
        </div>
        <div 
          className="absolute -bottom-4 -left-4 border border-white/20 bg-black/50 backdrop-blur-md text-white mono text-[10px] px-4 py-2 rounded-full shadow-xl transition-transform duration-300"
          style={{ transform: `translateZ(30px) translateX(${coords.x * -20}px) translateY(${coords.y * -20}px)` }}
        >
          AVAILABLE
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('nk_lang') as Lang) || 'en');
  const [activeStack, setActiveStack] = useState<string>('Android');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch('./data/profile.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
      })
      .catch(err => console.error("Data load failed", err));

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lang]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.section-fade').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [data, lang]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  if (!data) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>
  );

  const t = data.i18n[lang];
  const sectionIds = ['about', 'experience', 'projects', 'stack', 'contact'];

  return (
    <div className="relative z-10">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-[2px] bg-white z-[200] transition-all duration-300" 
           style={{ width: `${(scrolled ? 100 : 0)}%` }}></div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-[150] transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5 py-4' : 'py-10'} px-6 lg:px-12`}>
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-12">
            <a href="#" onClick={(e) => scrollToSection(e, 'about')} className="text-white font-black tracking-tighter text-2xl flex items-center gap-2">
              <span className="mono bg-white text-black px-1.5 py-0.5 rounded-sm">NK</span>
              <span className="hidden sm:inline-block">KUZENKO</span>
            </a>
            
            <div className="hidden lg:flex space-x-8 items-center">
              {t.nav.map((item, idx) => (
                <a key={item} href={`#${sectionIds[idx]}`} 
                   onClick={(e) => scrollToSection(e, sectionIds[idx])}
                   className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-all">
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-4 items-center">
              {(['en', 'uk', 'ru'] as Lang[]).map((l) => (
                <button 
                  key={l} 
                  onClick={() => { setLang(l); localStorage.setItem('nk_lang', l); }}
                  className={`text-[9px] font-bold px-2 py-1 border rounded-sm transition-all ${lang === l ? 'border-white text-white' : 'border-white/10 text-zinc-600 hover:text-zinc-400'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-white">
              <Menu size={24} />
            </button>
            <a href={data.contacts.telegram.url} target="_blank" className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform">
              Direct <Send size={14} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="min-h-screen flex flex-col justify-center px-6 lg:px-12 pt-40">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-3 mb-8 section-fade">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="mono text-[10px] text-zinc-500 tracking-widest uppercase">{t.location} — ACTIVE NOW</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-8">
              <h1 className="text-6xl md:text-8xl lg:text-[11rem] font-bold text-white leading-[0.85] tracking-tighter section-fade">
                {t.hero_title.split('<br/>').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end section-fade">
              <InteractivePhoto />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start section-fade">
            <div className="lg:col-span-7 space-y-12">
               <div className="flex flex-wrap gap-4">
                 {t.roles.map(role => (
                   <span key={role} className="mono text-zinc-400 text-sm border border-white/10 px-4 py-2 rounded-full bg-white/[0.02]">
                     {role}
                   </span>
                 ))}
               </div>
               <p className="text-3xl md:text-5xl text-zinc-500 leading-tight font-light max-w-4xl">
                 {t.hero_desc} <span className="text-white italic">{t.hero_focus}</span>
               </p>
            </div>
            
            <div className="lg:col-span-5 lg:pl-20 space-y-8">
               <p className="text-zinc-400 text-lg leading-relaxed font-light">
                 {t.about}
               </p>
               <div className="flex gap-6">
                 <a href={data.contacts.github.url} target="_blank" className="p-4 border border-white/5 rounded-full hover:bg-white hover:text-black transition-all interactive"><Github size={24} /></a>
                 <a href={data.contacts.email.url} className="p-4 border border-white/5 rounded-full hover:bg-white hover:text-black transition-all interactive"><Mail size={24} /></a>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Grid */}
      <section className="py-40 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {t.specialization.map((spec, i) => (
              <div key={i} className="group p-12 border border-white/5 hover:bg-white/[0.02] transition-all card-interactive flex flex-col justify-between h-[450px] section-fade">
                <div className="space-y-12">
                  <div className="mono text-[10px] text-zinc-700">0{i+1} / DOMAIN</div>
                  <h3 className="text-3xl font-bold text-white tracking-tighter leading-none">{spec.title}</h3>
                </div>
                <div className="space-y-6">
                  <div className="w-12 h-[1px] bg-zinc-800 group-hover:w-full transition-all duration-700"></div>
                  <p className="text-zinc-500 text-sm leading-relaxed">{spec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience - Terminal Style */}
      <section id="experience" className="py-40 px-6 lg:px-12 bg-zinc-950/30">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-32 section-fade">
            <div className="space-y-4">
              <div className="mono text-[10px] text-zinc-600 tracking-[0.5em] uppercase">{t.sections.experience}</div>
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">THE TRACK RECORD.</h2>
            </div>
            <div className="mono text-[11px] text-zinc-500 border-l border-zinc-800 pl-6 max-w-xs">
              ACTIVE DEVELOPMENT FOR 5+ YEARS IN HIGH-LOAD ENVIRONMENTS.
            </div>
          </div>

          <div className="space-y-px bg-zinc-900 border border-zinc-900">
            {t.experience.map((exp, i) => (
              <div key={i} className="group grid grid-cols-1 lg:grid-cols-12 bg-black p-8 lg:p-20 hover:bg-zinc-950/50 transition-all section-fade">
                <div className="lg:col-span-4 mb-12 lg:mb-0">
                   <div className="mono text-[10px] text-zinc-600 mb-4">{exp.period}</div>
                   <h3 className="text-4xl lg:text-6xl font-bold text-white tracking-tighter mb-2">{exp.company}</h3>
                   <div className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">{exp.role}</div>
                </div>
                <div className="lg:col-span-8 lg:pl-20">
                   <ul className="space-y-8">
                     {exp.details.map((detail, j) => (
                       <li key={j} className="flex gap-6 group/item">
                         <span className="mono text-zinc-800 mt-1.5 flex-shrink-0 text-[10px]">[{j+1}]</span>
                         <p className="text-xl text-zinc-400 font-light leading-relaxed group-hover/item:text-zinc-200 transition-colors">
                           {detail}
                         </p>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Horizontal Reveal */}
      <section id="projects" className="py-40 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-6 mb-24 section-fade">
            <h2 className="text-[10px] mono text-zinc-500 uppercase tracking-[0.5em]">{t.sections.projects}</h2>
            <div className="h-[1px] flex-grow bg-zinc-900"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {t.projects.map((proj, i) => (
               <div key={i} className="group relative bg-zinc-950 border border-white/5 p-12 lg:p-16 overflow-hidden section-fade interactive">
                  <div className="relative z-10 space-y-12">
                    <div className="flex justify-between items-start">
                       <div className="mono text-[10px] text-zinc-700">{proj.company}</div>
                       <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                         <ChevronRight size={20} />
                       </div>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tighter">{proj.name}</h3>
                    <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-lg">{proj.desc}</p>
                    <div className="mono text-[10px] text-zinc-600 border-t border-zinc-900 pt-8 uppercase tracking-widest">
                      {proj.tech}
                    </div>
                  </div>
                  {/* Background decoration */}
                  <div className="absolute -bottom-20 -right-20 text-[15rem] font-black text-white/[0.01] pointer-events-none select-none">
                    0{i+1}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Tech Stack - Interactive Selector */}
      <section id="stack" className="py-40 px-6 lg:px-12 bg-white text-black rounded-t-[4rem]">
        <div className="max-w-[1600px] mx-auto section-fade">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4">
               <div className="sticky top-40 space-y-12">
                 <div className="space-y-4">
                   <div className="mono text-[10px] text-zinc-400 tracking-[0.5em] uppercase">{t.sections.stack}</div>
                   <h2 className="text-6xl font-bold tracking-tighter leading-[0.9]">TECHNICAL ARCHITECTURE.</h2>
                 </div>
                 <div className="flex flex-col gap-2">
                   {Object.keys(data.techStack).map(key => (
                     <button 
                       key={key} 
                       onClick={() => setActiveStack(key)}
                       className={`flex items-center justify-between px-6 py-4 rounded-xl text-left transition-all ${activeStack === key ? 'bg-black text-white shadow-2xl' : 'text-zinc-400 hover:text-black hover:bg-zinc-100'}`}
                     >
                       <span className="text-sm font-bold uppercase tracking-widest">{key}</span>
                       <ChevronRight size={16} className={`${activeStack === key ? 'opacity-100' : 'opacity-0'}`} />
                     </button>
                   ))}
                 </div>
               </div>
            </div>
            <div className="lg:col-span-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {data.techStack[activeStack].map((tech, i) => {
                   const [name, desc] = tech.split('—');
                   return (
                     <div key={tech} className="bg-zinc-50 p-10 rounded-2xl border border-zinc-100 hover:border-black transition-all group">
                       <div className="flex items-center gap-4 mb-4">
                         <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-black transition-colors">
                           <Code2 size={16} />
                         </div>
                         <span className="text-xl font-bold tracking-tighter">{name.trim()}</span>
                       </div>
                       <p className="text-sm text-zinc-500 leading-relaxed font-light">{desc?.trim() || 'Core implementation and delivery.'}</p>
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="py-40 px-6 lg:px-12 bg-black text-white relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto text-center section-fade">
          <div className="flex flex-wrap justify-center gap-12 mb-32">
            {t.lang_levels.map(l => (
              <div key={l.name} className="space-y-1">
                <div className="text-3xl font-bold tracking-tighter">{l.name}</div>
                <div className="mono text-[9px] text-zinc-600 uppercase tracking-widest">{l.level}</div>
              </div>
            ))}
          </div>

          <h2 className="text-6xl md:text-8xl lg:text-[12rem] font-bold tracking-tighter leading-[0.8] mb-32">
            LET'S<br/>BUILD.
          </h2>

          <div className="flex flex-wrap justify-center gap-6 mb-40">
            <a href={data.contacts.telegram.url} target="_blank" className="px-16 py-8 bg-white text-black text-2xl font-bold rounded-2xl hover:scale-105 transition-transform flex items-center gap-4 interactive">
              Telegram <Send size={24} />
            </a>
            <a href={data.contacts.email.url} className="px-16 py-8 border border-white/10 text-white text-2xl font-bold rounded-2xl hover:bg-white hover:text-black transition-all flex items-center gap-4 interactive">
              Email <Mail size={24} />
            </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-white/5">
             <div className="mono text-[9px] text-zinc-600 tracking-widest uppercase mb-8 md:mb-0">
               © {new Date().getFullYear()} NAZAR KUZENKO — SENIOR MOBILE ENGINEER — KYIV BASED
             </div>
             <div className="flex gap-12">
               <a href={data.contacts.github.url} target="_blank" className="mono text-[9px] text-zinc-500 hover:text-white tracking-widest uppercase transition-colors interactive">GitHub</a>
               <div className="flex items-center gap-2 mono text-[9px] text-zinc-800 tracking-widest uppercase">
                 <Globe size={10} /> AVAILABLE FOR REMOTE
               </div>
             </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[200] transition-all duration-700 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-zinc-950 p-12 flex flex-col justify-center gap-12 transition-transform duration-700 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <button onClick={() => setIsMenuOpen(false)} className="absolute top-12 right-12 text-white"><X size={32}/></button>
           {t.nav.map((item, idx) => (
             <a key={item} href={`#${sectionIds[idx]}`} 
                onClick={(e) => scrollToSection(e, sectionIds[idx])}
                className="text-6xl font-bold text-white tracking-tighter hover:text-zinc-600 transition-colors">
               {item}
             </a>
           ))}
           <div className="flex gap-4 mt-20">
             {(['en', 'uk', 'ru'] as Lang[]).map((l) => (
                <button key={l} onClick={() => { setLang(l); localStorage.setItem('nk_lang', l); setIsMenuOpen(false); }} className={`px-4 py-2 border rounded-full text-xs font-bold ${lang === l ? 'bg-white text-black' : 'border-white/10 text-white'}`}>
                  {l.toUpperCase()}
                </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;
