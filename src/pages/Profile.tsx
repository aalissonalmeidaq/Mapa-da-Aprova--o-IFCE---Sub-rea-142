import { useUserStore } from '../store/userStore'
import { Zap, Trophy, Flame, Target, Clock, Heart, Award, ArrowLeft, Settings, Camera, Share2, User } from 'lucide-react'

export function Profile({ onBack }: { onBack: () => void }) {
  const { profile } = useUserStore()
  
  // Mock statistics for a gamer feel
  const stats = [
    { label: 'Ofensiva', value: '12 dias', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Total de XP', value: profile?.xp || 0, icon: Zap, color: 'text-secondary-400', bg: 'bg-secondary-500/10' },
    { label: 'Nível', value: profile?.level || 1, icon: Trophy, color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { label: 'Vidas', value: '5/5', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
  ]

  const achievements = [
    { title: 'Primeiros Passos', desc: 'Completou a primeira missão', icon: Award, date: '12 Mar' },
    { title: 'Guerreiro da AOCP', desc: 'Acertou 100% em um simulado', icon: Target, date: '15 Mar' },
    { title: 'Focado no IFCE', desc: 'Estudou por 5 dias seguidos', icon: Clock, date: 'Hoje' },
  ]

  return (
    <div className="w-full h-full pb-20 animate-fade-in">
       {/* Profile Header */}
       <div className="relative mb-12">
          {/* Banner / Cover */}
          <div className="h-48 w-full bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-transparent rounded-b-[3rem] overflow-hidden border-b border-white/5 relative">
             <div className="absolute inset-0 bg-grid-white/5" />
             <button onClick={onBack} className="absolute top-6 left-6 btn-outline h-10 px-4 rounded-xl backdrop-blur-md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
             </button>
             <div className="absolute top-6 right-6 flex gap-2">
                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md border border-white/5 transition-all">
                   <Share2 className="w-4 h-4 text-slate-300" />
                </button>
                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md border border-white/5 transition-all">
                   <Settings className="w-4 h-4 text-slate-300" />
                </button>
             </div>
          </div>

          {/* Avatar Area */}
          <div className="flex flex-col items-center -mt-20 px-6">
             <div className="relative group">
                <div className="w-36 h-36 rounded-[2.5rem] bg-slate-800 border-4 border-[#0a0a0b] shadow-2xl overflow-hidden ring-1 ring-white/10">
                   <User className="w-full h-full p-6 text-slate-500" />
                </div>
                <button className="absolute bottom-2 right-2 p-2.5 bg-primary-500 rounded-2xl shadow-lg border-2 border-[#0a0a0b] hover:scale-110 transition-transform">
                   <Camera className="w-4 h-4 text-white" />
                </button>
             </div>

             <div className="mt-4 text-center">
                <h1 className="text-2xl font-black font-mono text-white tracking-tight">Estudante Viajante</h1>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">
                   Entrou em Março de 2026
                </p>
             </div>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 mb-12 max-w-4xl mx-auto">
          {stats.map((stat, idx) => (
             <div key={idx} className="glass-panel p-5 rounded-[2rem] border-white/5 hover:border-white/10 transition-all group">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                   <stat.icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <p className="text-xs font-black uppercase text-slate-500 tracking-widest">{stat.label}</p>
                <p className="text-lg font-black text-white">{stat.value}</p>
             </div>
          ))}
       </div>

       {/* Main Section Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 max-w-4xl mx-auto">
          {/* Progress / Mastery */}
          <div className="space-y-6">
             <h3 className="flex items-center gap-3 text-sm font-black uppercase text-slate-500 tracking-widest">
                <Target className="w-4 h-4" />
                Domínio por Matéria
             </h3>
             
             <div className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-6">
                {[
                   { label: 'Língua Portuguesa', p: 85, color: 'bg-primary-500' },
                   { label: 'Didática', p: 40, color: 'bg-emerald-500' },
                   { label: 'Legislação', p: 65, color: 'bg-amber-500' },
                   { label: 'Conhecimentos Específicos', p: 20, color: 'bg-secondary-500' },
                ].map((m, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                         <span className="text-slate-200">{m.label}</span>
                         <span className="text-slate-400">{m.p}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.p}%` }} />
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Achievements */}
          <div className="space-y-6">
             <h3 className="flex items-center gap-3 text-sm font-black uppercase text-slate-500 tracking-widest">
                <Award className="w-4 h-4" />
                Conquistas
             </h3>

             <div className="space-y-3">
                {achievements.map((a, i) => (
                   <div key={i} className="flex items-center gap-4 p-5 glass-panel rounded-3xl border-white/5 hover:translate-x-1 transition-transform group">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary-500/50 transition-colors">
                         <a.icon className="w-6 h-6 text-slate-400 group-hover:text-primary-400 transition-colors" />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-sm font-bold text-white">{a.title}</h4>
                         <p className="text-[10px] text-slate-500 font-medium">{a.desc}</p>
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase">{a.date}</span>
                   </div>
                ))}
                <button className="w-full py-4 text-xs font-black uppercase text-slate-500 hover:text-white transition-colors">
                   Ver todas as 24 conquistas
                </button>
             </div>
          </div>
       </div>
    </div>
  )
}
