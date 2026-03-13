import { useState, useEffect } from 'react'
import { ArrowLeft, BrainCircuit, Swords, Loader2, FileText } from 'lucide-react'
import { QuestTimer } from '../components/QuestTimer'
import { QuizEngine, type Question } from '../components/QuizEngine'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { supabase } from '../lib/supabase'

// Duration per implementation_plan: 2h principal, 1h secondary
function getDurationMinutes(type: string): number {
  return type === 'Principal' ? 120 : 60
}

export function QuestPlayer({ questId, topic, type, onBack, onComplete }: { questId: string, topic: string, type: string, onBack: () => void, onComplete: (score: number, passed: boolean) => void }) {
  const [content,        setContent]        = useState<string>('')
  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingQuiz,    setLoadingQuiz]    = useState(false)
  const [timerReady,     setTimerReady]     = useState(false)
  const [showQuiz,       setShowQuiz]       = useState(false)
  const [questions,      setQuestions]      = useState<Question[]>([])

  const durationMinutes = getDurationMinutes(type)

  useEffect(() => {
    async function fetchQuest() {
      try {
        const { data, error } = await supabase.functions.invoke('generate-quest', {
          body: { topic, type }
        })
        if (error) throw error
        setContent(data.content || 'Nenhum conteúdo recebido.')
      } catch (err: any) {
        setContent(`**Erro ao carregar missão:** ${err.message}\n\nRetorne ao mapa e tente novamente.`)
      } finally {
        setLoadingContent(false)
      }
    }
    fetchQuest()
  }, [questId, topic, type])

  const handleStartQuiz = async () => {
    setLoadingQuiz(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topic, content }
      })
      if (error) throw error
      setQuestions(data.questions || [])
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
  return (
    <div className="min-h-screen text-white bg-dark-900 animate-fade-in">
      <div className="fixed top-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-primary-600/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[28rem] h-[28rem] bg-secondary-600/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Content */}
          <div className="lg:col-span-2 space-y-5">
            <button onClick={onBack} className="btn-outline w-fit text-sm h-10 px-4 rounded-xl group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Retornar ao Mapa
            </button>

            <div className="glass-panel p-8 md:p-10 rounded-[2rem] min-h-[70vh]">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8 pb-7 border-b border-white/8">
                <div className="p-3 bg-primary-500/15 rounded-2xl ring-1 ring-primary-500/30">
                  <BrainCircuit className="text-primary-400 w-7 h-7" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-sans mb-0.5">
                    Conteúdo Gerado por IA
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-white leading-snug font-mono">
                    {topic}
                  </h1>
                </div>
              </div>

              {/* Content */}
              {loadingContent ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary-400 font-semibold font-sans mb-6 animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando conteúdo focado no edital...
                  </div>
                  {[100, 90, 95, 80, 100, 70, 85].map((w, i) => (
                    <div
                      key={i}
                      className="h-4 bg-dark-700 rounded-full animate-pulse"
                      style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }}
                    />
                  ))}
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
