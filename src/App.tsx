import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Zap, LogOut, Shield, Calendar, Target } from 'lucide-react'
import { supabase } from './lib/supabase'
import { useUserStore } from './store/userStore'
import { Auth } from './pages/Auth'
import { QuestMap, type Quest } from './components/QuestMap'
import { QuestPlayer } from './pages/QuestPlayer'
import { ErrorBoundary } from './components/ErrorBoundary'
import { getQuestsForDate, getTodaySchedule, getCurrentWeek, getDaysUntilExam } from './data/schedule'

function Dashboard() {
  const { user, profile, signOut } = useUserStore()

  // Load quests from cronograma based on today's date
  const todaySchedule = getTodaySchedule()
  const initialQuests = getQuestsForDate()

  const [quests, setQuests] = useState<Quest[]>(initialQuests.length > 0 ? initialQuests : getQuestsForDate('16/03'))
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null)
  const [viewState, setViewState] = useState<'MAP' | 'QUEST' | 'RESULT'>('MAP')
  const [lastResult, setLastResult] = useState<{ score: number; passed: boolean } | null>(null)

  const currentWeek = getCurrentWeek()
  const daysUntilExam = getDaysUntilExam()

  const handleSelectQuest = (q: Quest) => {
    setActiveQuest(q)
    setViewState('QUEST')
  }

  const handleQuestComplete = (score: number, passed: boolean) => {
    setLastResult({ score, passed })
    setViewState('RESULT')
    if (passed && activeQuest) {
      const idx = quests.findIndex(q => q.id === activeQuest.id)
      if (idx === -1) return // guard: quest not found
      const updated = [...quests]
      updated[idx] = { ...updated[idx], status: 'completed' }
      if (idx + 1 < updated.length && updated[idx + 1].status === 'locked') {
        updated[idx + 1] = { ...updated[idx + 1], status: 'available' }
      }
      setQuests(updated)
    }
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
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        {/* Ambient glow */}
        <div className={`fixed inset-0 pointer-events-none ${passed ? 'bg-green-900/10' : 'bg-red-900/10'}`} />
        <div className="glass-panel max-w-lg w-full p-10 text-center rounded-[2rem] animate-scale-in relative">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${passed ? 'bg-green-500/15 ring-1 ring-green-500/30' : 'bg-red-500/15 ring-1 ring-red-500/30'}`}>
            {passed
              ? <CheckCircle2 className="w-10 h-10 text-green-400" />
              : <XCircle      className="w-10 h-10 text-red-400" />}
          </div>

          <h2 className={`text-3xl font-bold font-mono mb-2 ${passed ? 'text-green-300' : 'text-red-300'}`}>
            {passed ? 'Missão Cumprida!' : 'Missão Falhou'}
          </h2>

          {/* Score ring */}
          <div className={`text-6xl font-mono font-black my-4 ${passed ? 'text-green-400' : 'text-red-400'}`}>
            {lastResult.score.toFixed(0)}%
          </div>
          <div className="text-xs text-slate-500 font-sans uppercase tracking-widest mb-6">
            Aproveitamento · Mínimo 80%
          </div>

          {/* XP earned (only on pass) */}
          {passed && activeQuest && (
            <div className="flex items-center justify-center gap-2 mb-6 px-5 py-3
                            bg-secondary-500/10 rounded-xl border border-secondary-500/20">
              <Zap className="w-5 h-5 text-secondary-400" />
              <span className="text-secondary-300 font-bold font-sans">
                +{activeQuest.xpReward} XP conquistados
              </span>
            </div>
          )}

          <p className="text-slate-400 mb-8 leading-relaxed font-sans text-sm">
            {passed
              ? 'Excelente desempenho! A próxima missão foi desbloqueada no mapa da jornada.'
              : 'A banca avaliadora identificou lacunas conceituais. Revise o material e tente novamente.'}
          </p>

          <button onClick={() => setViewState('MAP')} className="btn-primary w-full h-14 sm:h-12 text-base">
            Voltar ao Mapa
          </button>
        </div>
      </div>
    )
  }

  // XP progress within current level (0–1000 per level)
  const xpInLevel  = (profile?.xp || 0) % 1000
  const xpPercent  = Math.min((xpInLevel / 1000) * 100, 100)
  const today      = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  return (
    <div className="min-h-screen bg-dark-900 text-white pb-16 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary-600/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-secondary-600/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center pt-8 md:pt-20 px-4 md:px-12">

        {/* Top bar */}
        <div className="flex w-full justify-between items-center mb-8 md:mb-14">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary-500/15 rounded-full flex items-center justify-center
                            border border-primary-500/20 font-bold font-mono text-primary-400 uppercase">
              {user?.email?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-500 font-sans mb-0.5">
                <Shield className="w-3 h-3" /> Candidato IFCE
              </div>
              <div className="text-white font-bold font-mono">
                Nível <span className="text-primary-400">{profile?.level || 1}</span>
              </div>
            </div>
          </div>

          <button onClick={signOut} className="btn-outline h-10 px-5 rounded-xl text-sm gap-2">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        {/* World title */}
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold font-mono text-transparent bg-clip-text
                       bg-gradient-to-br from-white via-slate-200 to-slate-500
                       mb-4 text-center tracking-tight leading-tight">
          Semana {currentWeek}: {currentWeek <= 2 ? 'Fundamentos' : currentWeek <= 4 ? 'Intermediário' : 'Sprint Final'}
        </h1>

        {/* Countdown & Stats */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-6">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-dark-800/80 rounded-xl border border-white/5">
            <Calendar className="w-4 h-4 text-primary-400 shrink-0" />
            <span className="text-sm font-sans text-slate-400">
              <span className="text-white font-bold">{daysUntilExam}</span> dias para a prova
            </span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-dark-800/80 rounded-xl border border-white/5">
            <Target className="w-4 h-4 text-secondary-400 shrink-0" />
            <span className="text-sm font-sans text-slate-400">
              Prova: <span className="text-white font-bold">26/04</span>
            </span>
          </div>
        </div>

        {/* XP bar */}
        <div className="w-full max-w-sm mb-8 md:mb-12">
          <div className="flex justify-between text-xs text-slate-500 font-sans mb-2 px-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-secondary-400" />
              {xpInLevel} / 1000 XP
            </span>
            <span>Nível {profile?.level || 1} → {(profile?.level || 1) + 1}</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-3 overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-700"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6 md:mb-10" />

        {/* Quest section */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-mono text-white">Quests do Dia</h2>
            <p className="text-slate-500 mt-1.5 font-sans text-sm">
              {today} · {todaySchedule?.dayOfWeek || 'Sem cronograma'} · Carga: {todaySchedule?.hours || 'N/D'}
            </p>
          </div>
          {quests.length > 0 ? (
            <QuestMap quests={quests} onSelectQuest={handleSelectQuest} />
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 font-sans text-lg">Nenhuma missão para hoje no cronograma.</p>
              <p className="text-slate-600 font-sans text-sm mt-2">Aproveite para revisar conteúdos anteriores.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const { user, setUser, fetchProfile } = useUserStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
    }).catch(() => {
      // Supabase offline / network failure — stay on auth screen
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
