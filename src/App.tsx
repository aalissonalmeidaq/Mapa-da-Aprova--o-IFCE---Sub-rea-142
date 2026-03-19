import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import { supabase } from './lib/supabase'
import { useUserStore } from './store/userStore'
import { Auth } from './pages/Auth'
import type { Quest } from './components/QuestMap'
import { QuestPlayer } from './pages/QuestPlayer'
import { ErrorBoundary } from './components/ErrorBoundary'
import { QuestTrail } from './components/QuestTrail'
import { Layout } from './components/Layout'
import { Profile } from './pages/Profile'
import { Settings } from './pages/Settings'
import type { Session } from '@supabase/supabase-js'

function Dashboard() {

  // Manage quests globally for selected day
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null)
  const [viewState, setViewState] = useState<'MAP' | 'QUEST' | 'RESULT' | 'PROFILE' | 'SETTINGS'>('MAP')
  const [lastResult, setLastResult] = useState<{ score: number; passed: boolean } | null>(null)
  
  // Reset cache globally once for DeepSeek transition
  useEffect(() => {
    const purgeCacheForDeepSeek = async () => {
      const purged = localStorage.getItem('deepseek_purge_v1')
      if (purged) return
      
      console.log('🔄 Iniciando limpeza global de cache para DeepSeek...')
      try {
        // Remove all records from supabase (since ID is uuid, we use a range or just not empty)
        const { error } = await supabase.from('quest_contents').delete().neq('quest_id', '')
        if (!error) {
          localStorage.setItem('deepseek_purge_v1', 'true')
          console.log('✅ Cache global limpo com sucesso.')
        }
      } catch (err) {
        console.error('❌ Falha ao limpar cache global:', err)
      }
    }
    purgeCacheForDeepSeek()
  }, [])

  const handleSelectQuest = (q: Quest) => {
    setActiveQuest(q)
    setViewState('QUEST')
  }

  const handleQuestComplete = (score: number, passed: boolean) => {
    setLastResult({ score, passed })
    setViewState('RESULT')
  }

  const handleTabChange = (tab: 'MAP' | 'PROFILE' | 'SETTINGS') => {
    setViewState(tab)
  }

  if (viewState === 'QUEST' && activeQuest) {
    return (
      <QuestPlayer
        questId={activeQuest.id}
        topic={activeQuest.topic}
        type={activeQuest.type}
        onBack={() => setViewState('MAP')}
        onComplete={handleQuestComplete}
      />
    )
  }

  if (viewState === 'RESULT' && lastResult) {
    const passed = lastResult.passed
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Background Decor */}
        <div className={`fixed inset-0 pointer-events-none opacity-20 blur-[150px] rounded-full ${passed ? 'bg-emerald-500/10' : 'bg-red-500/10'}`} />
        
        <div className="glass-panel max-w-xl w-full p-12 text-center rounded-[3.5rem] animate-scale-in relative border-white/5 shadow-2xl overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1.5 ${passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
          
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-[2rem] mb-10 shadow-2xl ring-1 ${passed ? 'bg-emerald-500/10 ring-emerald-500/20' : 'bg-red-500/10 ring-red-500/20'}`}>
            {passed ? <CheckCircle2 className="w-12 h-12 text-emerald-400" /> : <XCircle className="w-12 h-12 text-red-400" />}
          </div>
          
          <h2 className={`text-4xl font-black font-mono mb-4 uppercase tracking-tighter ${passed ? 'text-white' : 'text-white'}`}>
            {passed ? 'MISSÃO CONCLUÍDA' : 'MISSÃO FALHOU'}
          </h2>
          
          <div className="flex flex-col items-center mb-10">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">SCORE DE PRECISÃO</span>
             <div className={`text-7xl font-mono font-black ${passed ? 'text-emerald-400' : 'text-red-400'} drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]`}>
                {lastResult.score.toFixed(0)}<span className="text-3xl opacity-50">%</span>
             </div>
          </div>

          <p className="text-slate-400 mb-12 font-bold max-w-sm mx-auto leading-relaxed">
            {passed 
              ? 'Excelente performance operacional. O conteúdo foi devidamente mapeado e processado pelo seu sistema.' 
              : 'Detectamos falhas na retenção de dados críticos. Retorne ao mapa para nova sessão de sincronização.'}
          </p>
          
          <button 
            onClick={() => setViewState('MAP')} 
            className={`w-full h-16 rounded-[2rem] flex items-center justify-center gap-4 group relative overflow-hidden transition-all active:scale-95 ${passed ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            <span className="text-lg font-black uppercase tracking-widest text-white relative z-10">
               {passed ? 'Prosseguir para Próxima Quest' : 'Reiniciar Sincronização'}
            </span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <Layout 
      activeTab={viewState === 'PROFILE' ? 'PROFILE' : viewState === 'SETTINGS' ? 'SETTINGS' : 'MAP'} 
      onTabChange={handleTabChange}
    >
      {viewState === 'PROFILE' ? (
        <Profile onBack={() => setViewState('MAP')} />
      ) : viewState === 'SETTINGS' ? (
        <Settings onBack={() => setViewState('MAP')} />
      ) : (
        <QuestTrail onSelectQuest={handleSelectQuest} />
      )}
    </Layout>
  )
}


function App() {
  const { user, setUser, fetchProfile } = useUserStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
    }).catch(() => {
      // Supabase offline / network failure — stay on auth screen
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <ErrorBoundary>
      <Router>
        <div className="dark min-h-screen bg-dark-900 selection:bg-primary-500/30">
          <Routes>
            {/* Fixed routing — removed broken window.location.hash check */}
            <Route path="/"          element={!user ? <Auth />        : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={ user ? <Dashboard />   : <Navigate to="/"          replace />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
