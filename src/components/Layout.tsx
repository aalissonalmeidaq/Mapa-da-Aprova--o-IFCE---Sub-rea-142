import React, { type ReactNode } from 'react'
import { Home, Trophy, User, Settings, Zap, Calendar, Heart } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import { ExamCountdown } from './ExamCountdown'

interface LayoutProps {
  children: ReactNode
  activeTab: 'MAP' | 'PROFILE' | 'SETTINGS'
  onTabChange: (tab: 'MAP' | 'PROFILE' | 'SETTINGS') => void
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { profile, signOut } = useUserStore()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  const navItems = [
    { id: 'MAP', icon: Home, label: 'Início' },
    { id: 'PROFILE', icon: User, label: 'Perfil' },
    { id: 'SETTINGS', icon: Settings, label: 'Configurações' },
  ] as const

  return (
    <div className="min-h-screen bg-[#020617] text-[#f0fdfa] flex overflow-hidden font-sans selection:bg-teal-500/30">
      {/* Liquid Glass Background Elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[50rem] h-[50rem] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse-slow" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse-slow" />
      
      {/* Floating Particles Decor */}
      <div className="absolute top-20 left-[20%] w-1 h-1 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[60%] left-[80%] w-2 h-2 bg-white/10 rounded-full animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[40%] left-[50%] w-1.5 h-1.5 bg-teal-400/20 rounded-full animate-float" style={{ animationDelay: '5s' }} />

      {/* DESKTOP SIDEBAR */}
      <aside 
        className={`hidden md:flex flex-col border-r border-white/5 bg-[#0a0a0b]/80 backdrop-blur-xl z-30 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="p-8 mb-4">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-900/40 shrink-0 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-7 h-7 text-white fill-white animate-pulse" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter text-white leading-none">
                  MAPA <span className="text-teal-400">IFCE</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Subárea 142</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${
                activeTab === item.id 
                  ? 'bg-teal-500/10 text-teal-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <item.icon className={`w-6 h-6 transition-all duration-500 ${activeTab === item.id ? 'stroke-[2.5] scale-110' : 'group-hover:scale-110'}`} />
              {isSidebarOpen && <span className="font-black tracking-tight">{item.label}</span>}
              {activeTab === item.id && isSidebarOpen && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-teal-400 rounded-full shadow-[0_0_12px_rgba(45,212,191,0.8)] animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           {isSidebarOpen ? (
             <div className="bg-dark-800/50 p-4 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 ring-2 ring-white/10 overflow-hidden">
                    <User className="w-full h-full p-2 text-slate-500" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">Estudante</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{profile?.xp || 0} XP</p>
                  </div>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  Sair da Conta
                </button>
             </div>
           ) : (
             <button onClick={() => setIsSidebarOpen(true)} className="w-full p-4 text-slate-500 hover:text-white">
                <User className="w-6 h-6 mx-auto" />
             </button>
           )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* HEADER (Sticky for both) */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a0b]/60 backdrop-blur-xl flex items-center justify-between px-6 z-20 sticky top-0 md:static">
          <div className="md:hidden flex items-center gap-3">
             <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
             </div>
             <span className="font-black text-lg tracking-tight">IFCE</span>
          </div>

          <div className="hidden md:block">
             <h1 className="font-mono text-sm text-slate-500 uppercase tracking-widest font-bold">
                Jornada de Aprendizado
             </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform group">
               <Zap className="w-5 h-5 text-orange-500 fill-orange-500 group-hover:animate-bounce" />
               <span className="font-black text-sm tracking-tighter">{profile?.xp || 0} XP</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform group">
               <Calendar className="w-5 h-5 text-teal-400 stroke-[2.5] group-hover:animate-float" />
               <span className="font-black text-sm tracking-tighter">12d</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform group">
               <Heart className="w-5 h-5 text-red-500 fill-red-500 group-hover:animate-pulse" />
               <span className="font-black text-sm tracking-tighter">5</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
           <div className="max-w-7xl mx-auto w-full h-full lg:flex lg:gap-8 lg:px-8">
              <div className="flex-1">
                 {children}
              </div>

              {/* RIGHT SIDEBAR (Desktop Only) */}
              <aside className="hidden lg:block w-80 space-y-8 py-10">
                 {/* Exam Countdown */}
                 <ExamCountdown />

                 {/* Social / Motivation */}
                 <div className="relative group overflow-hidden rounded-[2rem]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative p-6 glass-panel border-white/10 h-full flex flex-col items-center text-center">
                       <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                          <Trophy className="w-10 h-10 text-primary-400" />
                       </div>
                       <h4 className="text-lg font-black font-mono leading-tight mb-2">Desbloqueie Recompensas</h4>
                       <p className="text-xs text-slate-400">Complete missões e ganhe distintivos exclusivos do IFCE.</p>
                    </div>
                 </div>
              </aside>
           </div>
        </div>

        {/* MOBILE BOTTOM NAV */}
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-40">
           <div className="glass-panel h-16 rounded-[1.5rem] flex items-center justify-around px-4 shadow-2xl shadow-black/50 border-white/10 bg-[#0a0a0b]/80">
             {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center justify-center p-3 rounded-xl transition-all ${
                    activeTab === item.id ? 'text-primary-400 bg-primary-500/10' : 'text-slate-500'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                </button>
             ))}
           </div>
        </div>
      </main>
    </div>
  )
}
