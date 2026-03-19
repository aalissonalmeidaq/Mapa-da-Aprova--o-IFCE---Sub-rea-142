import React from 'react'
import { ArrowLeft, Cpu, Database, Trash2, CheckCircle2, AlertTriangle, Zap, Sparkles } from 'lucide-react'
import { useUserStore } from '../store/userStore'

interface SettingsProps {
  onBack: () => void
}

export function Settings({ onBack }: SettingsProps) {
  const { profile, setPreferredAI } = useUserStore()
  const [isClearing, setIsClearing] = React.useState(false)
  const [message, setMessage] = React.useState<{ text: string, type: 'success' | 'error' } | null>(null)

  const handleClearCache = async () => {
    if (!confirm('Isso apagará todo o conteúdo gerado localmente e no servidor. Você terá que aguardar a regeneração dos materiais. Continuar?')) return
    
    setIsClearing(true)
    try {
      // In a real app we'd need to list all questIds or have a 'clearAll' in questCache
      // For now we rely on the global reset in App.tsx or provide a manual trigger for the current session
      localStorage.clear() // Heavy handed but effective for local
      setMessage({ text: 'Cache local limpo. O servidor será sincronizado no próximo carregamento.', type: 'success' })
    } catch (err) {
      setMessage({ text: 'Erro ao limpar cache.', type: 'error' })
    } finally {
      setIsClearing(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const aiOptions = [
    { id: 'deepseek', name: 'DeepSeek Chat', desc: 'Alta velocidade, ótimo raciocínio em PT-BR.', icon: Zap, color: 'text-teal-400' },
    { id: 'gemini', name: 'Google Gemini', desc: 'Multimodal e altamente confiável.', icon: Sparkles, color: 'text-emerald-400' },
  ] as const

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-12 animate-fade-in relative z-10">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-8 border-b border-white/5">
           <div className="flex items-center gap-6">
              <button 
                onClick={onBack} 
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-95 group"
              >
                <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
              </button>
              <div>
                <h1 className="text-3xl font-black font-mono text-white tracking-tighter uppercase mb-1">Configurações</h1>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Ajustes do Sistema de Inteligência</p>
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          
          {/* AI ENGINE SECTION */}
          <section className="space-y-6">
             <div className="flex items-center gap-3">
                <Cpu className="w-6 h-6 text-teal-400" />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Motor de Inteligência</h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aiOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setPreferredAI(option.id)}
                    className={`p-6 rounded-[2.5rem] border transition-all text-left relative overflow-hidden group ${
                      profile?.preferred_ai === option.id 
                        ? 'bg-teal-500/10 border-teal-500/30' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                     <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className={`p-3 rounded-2xl bg-white/5 ${option.color}`}>
                           <option.icon className="w-6 h-6" />
                        </div>
                        {profile?.preferred_ai === option.id && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-teal-500/20 rounded-full border border-teal-500/20">
                             <CheckCircle2 className="w-3 h-3 text-teal-400" />
                             <span className="text-[10px] font-black text-teal-400 uppercase">Ativo</span>
                          </div>
                        )}
                     </div>
                     <h3 className="text-lg font-black text-white mb-1 relative z-10">{option.name}</h3>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed relative z-10">{option.desc}</p>
                     
                     {/* Glow effect on hover */}
                     <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
             </div>
             <p className="text-[10px] text-slate-500 font-medium italic">
                * O sistema automaticamente usará a outra IA como backup caso a preferencial esteja indisponível.
             </p>
          </section>

          {/* CACHE & DATA SECTION */}
          <section className="space-y-6">
             <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Gestão de Dados</h2>
             </div>
             
             <div className="glass-panel p-8 rounded-[3rem] border-white/5 bg-slate-900/40 space-y-6">
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-400">
                      <Trash2 className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                      <h3 className="text-lg font-black text-white mb-2">Limpeza de Cache de Estudo</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">
                         Apaga todos os roteiros, resumos e questões gerados pela IA até agora. 
                         Útil se você trocou de motor de IA e deseja que todo o conteúdo seja gerado novamente com o novo padrão.
                      </p>
                      
                      <button
                        onClick={handleClearCache}
                        disabled={isClearing}
                        className="px-8 py-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-2xl text-orange-400 text-sm font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-orange-950/20"
                      >
                         {isClearing ? 'Limpando...' : 'Apagar Tudo agora'}
                         <AlertTriangle className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </div>
          </section>

          {/* Feedback Messages */}
          {message && (
             <div className={`p-6 rounded-[2rem] border animate-scale-in flex items-center gap-4 ${
               message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
             }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                <span className="font-black text-sm uppercase tracking-tight">{message.text}</span>
             </div>
          )}
        </div>

      </div>
    </div>
  )
}
