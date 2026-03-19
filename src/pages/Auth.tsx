import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { BookOpen, LogIn, Mail, Lock, Loader2 } from 'lucide-react'

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) throw signUpError
        alert('Confirme seu email para continuar!')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro na autenticação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020617] font-sans">
      {/* Liquid Glass Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[60rem] h-[60rem] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse-slow" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse-slow" />
      
      {/* Glass Panel */}
      <div className="glass-panel w-full max-w-lg p-10 md:p-14 rounded-[3.5rem] z-10 animate-fade-in text-center shadow-[0_32px_64px_-16px_rgba(2,6,23,0.8)] border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 opacity-50" />
        
        <div className="inline-flex items-center justify-center p-6 bg-teal-500/10 rounded-[2rem] mb-10 shadow-2xl ring-1 ring-teal-500/20 group-hover:scale-110 transition-transform duration-500">
          <BookOpen className="w-14 h-14 text-teal-400 animate-float" />
        </div>
        
        <h1 className="text-4xl font-black text-white tracking-tighter mb-3 uppercase font-mono">
          MAPA <span className="text-teal-400">IFCE</span>
        </h1>
        <p className="text-slate-500 mb-12 font-black uppercase tracking-[0.3em] text-[10px]">Subárea 142 · Acesso Restrito</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-slide-up text-left flex items-start flex-col">
            <span className="font-semibold block mb-1">Acesso negado</span>
            <span>{error}</span>
          </div>
        )}

        <fieldset disabled={loading} className="contents">
        <form onSubmit={handleAuth} className="space-y-5">
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-slate-950/40 border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/30 transition-all font-black"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/40 border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/30 transition-all font-black"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full btn-primary h-16 mt-6 text-base rounded-[2rem] font-black uppercase tracking-widest shadow-[0_12px_24px_-8px_rgba(234,88,12,0.4)]"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogIn className="w-6 h-6" />}
            {isLogin ? 'Iniciar Missão' : 'Registrar Candidato'}
          </button>
        </form>
        </fieldset>

        <button
          onClick={() => setIsLogin(!isLogin)}
          disabled={loading}
          className="mt-10 text-[10px] text-slate-500 hover:text-teal-400 transition-colors duration-300 p-2 cursor-pointer font-black uppercase tracking-widest disabled:opacity-50"
        >
          {isLogin ? 'Novo por aqui? Criar acesso de estudante' : 'Já possui registro? Autenticar sistema'}
        </button>
      </div>
    </div>
  )
}
