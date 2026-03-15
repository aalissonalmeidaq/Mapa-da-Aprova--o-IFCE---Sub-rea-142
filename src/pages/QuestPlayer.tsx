import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, BrainCircuit, Swords, Loader2, FileText, BookOpen, DatabaseZap } from 'lucide-react'
import { QuestTimer } from '../components/QuestTimer'
import { QuizEngine, type Question } from '../components/QuizEngine'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { generateQuestContent, generateQuiz } from '../lib/gemini'
import { getCachedContent, saveCachedContent, type CacheSource } from '../lib/questCache'

// Duration per implementation_plan: 2h principal, 1h secondary
function getDurationMinutes(type: string): number {
  return type === 'Principal' ? 120 : 60
}

const TYPE_LABELS: Record<string, string> = {
  'Principal': '📌 Conhecimentos Específicos',
  'Secundaria_PT': '📝 Língua Portuguesa',
  'Secundaria_Didatica': '📚 Docência e Didática',
  'Secundaria_Legis': '⚖️ Legislação',
}

export function QuestPlayer({ questId, topic, type, onBack, onComplete }: { questId: string, topic: string, type: string, onBack: () => void, onComplete: (score: number, passed: boolean) => void }) {
  const [content,        setContent]        = useState<string>('')
  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingQuiz,    setLoadingQuiz]    = useState(false)
  const [timerReady,     setTimerReady]     = useState(false)
  const [showQuiz,       setShowQuiz]       = useState(false)
  const [questions,      setQuestions]      = useState<Question[]>([])
  const [cacheSource,    setCacheSource]    = useState<CacheSource>(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const durationMinutes = getDurationMinutes(type)

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    if (docHeight > 0) {
      setScrollProgress(Math.min((scrollTop / docHeight) * 100, 100))
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    let cancelled = false

    async function fetchQuest() {
      // 1️⃣ Verificar cache (localStorage → Supabase) antes de chamar a API
      const { content: cached, source } = await getCachedContent(questId)
      if (cached) {
        if (!cancelled) {
          setContent(cached)
          setCacheSource(source)
          setLoadingContent(false)
        }
        return
      }

      // 2️⃣ Cache miss — gerar via Gemini com streaming
      try {
        const finalContent = await generateQuestContent(topic, type, (accumulated) => {
          if (!cancelled) {
            setContent(accumulated)
            setLoadingContent(false)
          }
        })
        // Salvar em localStorage + Supabase para próximas visitas
        if (!cancelled && finalContent) {
          setCacheSource(null) // conteúdo novo, sem fonte de cache
          await saveCachedContent(questId, topic, type, finalContent)
        }
      } catch (err: any) {
        if (cancelled) return
        console.error('QuestPlayer fetchQuest error:', err)
        const errorMessage = err.message || 'Erro desconhecido'
        setContent(`**Erro ao carregar missão:** ${errorMessage}\n\nVerifique se a variável VITE_GEMINI_API_KEY está configurada no arquivo .env.local.\n\nRetorne ao mapa e tente novamente.`)
      } finally {
        if (!cancelled) setLoadingContent(false)
      }
    }
    fetchQuest()
    return () => { cancelled = true }
  }, [questId, topic, type])

  const handleStartQuiz = async () => {
    setLoadingQuiz(true)
    try {
      const quizQuestions = await generateQuiz(topic, content)
      setQuestions(quizQuestions as Question[])
      setShowQuiz(true)
    } catch (err: any) {
      alert(`Erro ao gerar Quiz via IA: ${err.message}`)
    } finally {
      setLoadingQuiz(false)
    }
  }

  // Loading quiz
  if (loadingQuiz) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-6 p-4 animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-secondary-500/30 border-t-secondary-500 animate-spin" />
          <Swords className="w-8 h-8 text-secondary-400 absolute inset-0 m-auto" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl text-white font-bold font-mono mb-2">Banca AOCP formulando questões...</h2>
          <p className="text-slate-400 font-sans text-sm">A IA está analisando o conteúdo estudado</p>
        </div>
      </div>
    )
  }

  // Quiz
  if (showQuiz) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-start justify-center p-4 md:p-8 pt-12 animate-fade-in">
        <div className="fixed top-[-10%] right-[-5%] w-96 h-96 bg-secondary-600/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-5%] w-80 h-80 bg-primary-600/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 w-full">
          <button onClick={onBack} className="btn-outline mb-6 w-fit text-sm h-10 px-4 rounded-xl group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Retornar ao Mapa
          </button>
          <QuizEngine questions={questions} onComplete={(score, passed) => onComplete(score, passed)} />
        </div>
      </div>
    )
  }

  // Reading / study state
  const typeLabel = TYPE_LABELS[type] || type
  const wordCount = content ? content.split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="min-h-screen text-white bg-dark-900 animate-fade-in">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-dark-800">
        <div
          className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="fixed top-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-primary-600/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[28rem] h-[28rem] bg-secondary-600/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Content — min-w-0 prevents grid item from overflowing */}
          <div className="lg:col-span-2 space-y-5 min-w-0">
            <button onClick={onBack} className="btn-outline w-fit text-sm h-10 px-4 rounded-xl group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Retornar ao Mapa
            </button>

            <div className="glass-panel p-6 md:p-10 lg:p-12 rounded-[2rem] min-h-[70vh]">
              {/* Header */}
              <div className="flex items-start gap-4 mb-8 pb-7 border-b border-white/8">
                <div className="p-3.5 bg-primary-500/15 rounded-2xl ring-1 ring-primary-500/30 mt-0.5">
                  <BrainCircuit className="text-primary-400 w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 font-sans
                                     bg-primary-500/10 px-2.5 py-1 rounded-lg">
                      {typeLabel}
                    </span>
                    {!loadingContent && (
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 font-sans">
                        <BookOpen className="w-3 h-3" />
                        ~{readingTime} min de leitura
                      </span>
                    )}
                    {!loadingContent && cacheSource && (
                      <span
                        title={cacheSource === 'supabase' ? 'Carregado do banco de dados' : 'Carregado do cache local'}
                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 font-sans bg-emerald-500/10 px-2 py-1 rounded-lg"
                      >
                        <DatabaseZap className="w-3 h-3" />
                        {cacheSource === 'supabase' ? 'cache db' : 'cache local'}
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-white leading-snug font-mono mt-2">
                    {topic}
                  </h1>
                </div>
              </div>

              {/* Content */}
              {loadingContent ? (
                <div className="space-y-4 py-8">
                  <div className="flex items-center gap-3 text-primary-400 font-semibold font-sans mb-8 animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando material detalhado focado no edital IFCE...
                  </div>
                  {[100, 90, 95, 80, 100, 70, 85, 92, 88, 75].map((w, i) => (
                    <div
                      key={i}
                      className="h-4 bg-dark-700 rounded-full animate-pulse"
                      style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }}
                    />
                  ))}
                  <div className="text-center text-xs text-slate-600 font-sans mt-8 animate-pulse">
                    Isso pode levar alguns segundos — estamos gerando conteúdo completo e detalhado
                  </div>
                </div>
              ) : (
                <MarkdownRenderer content={content} />
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5 lg:pt-16">
            {/* Meta chip */}
            <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="text-sm font-sans">
                <div className="text-slate-400">
                  Missão{' '}
                  <span className="text-white font-semibold">
                    {type === 'Principal' ? 'Principal' : 'Secundária'}
                  </span>
                </div>
                <div className="text-slate-500 text-xs mt-0.5">
                  {durationMinutes === 120 ? '2h de foco dedicado' : '1h de foco dedicado'}
                </div>
              </div>
            </div>

            {/* Timer — questId enables localStorage persistence */}
            <QuestTimer
              questId={questId}
              durationMinutes={durationMinutes}
              onComplete={() => setTimerReady(true)}
            />

            {/* CTA */}
            {timerReady && !showQuiz && (
              <button
                onClick={handleStartQuiz}
                className="btn-secondary w-full h-14 text-base uppercase tracking-wide rounded-xl relative overflow-hidden group animate-scale-in"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                <Swords className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Enfrentar o Teste (AOCP)</span>
              </button>
            )}

            {!timerReady && !loadingContent && (
              <p className="text-center text-xs text-slate-600 font-sans px-2">
                Inicie o timer e complete a sessão para desbloquear a avaliação.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
