import { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowLeft, Swords, BookOpen, DatabaseZap, Zap, Clock, Trophy, Loader2 } from 'lucide-react'
import { QuestTimer } from '../components/QuestTimer'
import { QuizEngine, type Question } from '../components/QuizEngine'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { generateQuestContent, generateQuiz } from '../lib/ai'
import { getCachedContent, saveCachedContent, type CacheSource } from '../lib/questCache'
import { sanitizeMarkdown } from '../lib/contentSanitizer'

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

function LoadingStatus({ subColor }: { subColor: string }) {
  const [statusMsg, setStatusMsg] = useState('Compilando Relatório de Inteligência...')
  
  useEffect(() => {
    const t1 = setTimeout(() => setStatusMsg('Otimizando conexão com rede neural...'), 4000)
    const t2 = setTimeout(() => setStatusMsg('Quase pronto: Processando dossiê final...'), 10000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className={`flex items-center gap-5 text-${subColor}-400 font-black uppercase tracking-[0.2em] text-sm mb-12 animate-pulse`}>
      <div className={`w-10 h-10 rounded-2xl ${subColor === 'teal' ? 'bg-teal-500/10 border-teal-500/20' : subColor === 'amber' ? 'bg-amber-500/10 border-amber-500/20' : subColor === 'indigo' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-slate-500/10 border-slate-500/20'} flex items-center justify-center border`}>
          <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      {statusMsg}
    </div>
  )
}

export function QuestPlayer({ questId, topic, type, onBack, onComplete }: { questId: string, topic: string, type: string, onBack: () => void, onComplete: (score: number, passed: boolean) => void }) {
  const [content,        setContent]        = useState<string>('')
  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingQuiz,    setLoadingQuiz]    = useState(false)
  const [error,          setError]          = useState<string | null>(null)
  const [timerReady,     setTimerReady]     = useState(false)
  const [showQuiz,       setShowQuiz]       = useState(false)
  const [questions,      setQuestions]      = useState<Question[]>([])
  const [cacheSource,    setCacheSource]    = useState<CacheSource>(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const durationMinutes = getDurationMinutes(type)
  const rafRef = useRef(0)

  const handleScroll = useCallback(() => {
    if (rafRef.current) return // skip if already queued
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setScrollProgress(Math.min((scrollTop / docHeight) * 100, 100))
      }
      rafRef.current = 0
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleScroll])

  useEffect(() => {
    let cancelled = false
    let rafId = 0
    let pendingChunk = ''

    function flushChunk() {
      rafId = 0
      if (cancelled) return
      setContent(pendingChunk)
      setLoadingContent(false)
    }

    async function fetchQuest() {
      // 1️⃣ Verificar cache (localStorage → Supabase) antes de chamar a API
      const { content: cached, source } = await getCachedContent(questId)
      if (cached) {
        if (!cancelled) {
          setContent(sanitizeMarkdown(cached, topic))
          setCacheSource(source)
          setLoadingContent(false)
        }
        return
      }

      // 2️⃣ Cache miss — gerar via IA com streaming
      try {
        if (!cancelled) setError(null)

        const finalContent = await generateQuestContent(questId, topic, type, (accumulated) => {
          if (cancelled || accumulated.length === 0) return
          // Throttle: agrupa todos os chunks que chegam no mesmo frame de animação
          pendingChunk = accumulated
          if (!rafId) rafId = requestAnimationFrame(flushChunk)
        })

        // Cancela rAF pendente antes de atualizar com o conteúdo final sanitizado
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0 }

        if (!cancelled && finalContent) {
          const clean = sanitizeMarkdown(finalContent, topic)
          setContent(clean)
          setLoadingContent(false)
          setCacheSource(null)
          await saveCachedContent(questId, topic, type, clean)
        } else if (!cancelled) {
          throw new Error('A IA não retornou conteúdo válido. Verifique as chaves de API ou troque o motor nas Configurações.')
        }
      } catch (err: any) {
        if (cancelled) return
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0 }
        console.error('QuestPlayer fetchQuest error:', err)
        setError(err.message || 'Falha na comunicação com a IA')
        setLoadingContent(false)
      }
    }

    fetchQuest()
    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [questId, topic, type])

  const handleStartQuiz = async () => {
    setLoadingQuiz(true)
    try {
      const quizQuestions = await generateQuiz(topic, content)
      if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
        throw new Error('A IA não retornou questões válidas. Tente novamente.')
      }
      // Validate each question has required fields
      const validated = quizQuestions.filter(
        (q): q is Question =>
          typeof q.text === 'string' &&
          Array.isArray(q.options) &&
          q.options.length >= 2 &&
          typeof q.correctIndex === 'number' &&
          typeof q.explanation === 'string',
      )
      if (validated.length === 0) {
        throw new Error('As questões geradas estão em formato inválido. Tente novamente.')
      }
      setQuestions(validated)
      setShowQuiz(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido'
      alert(`Erro ao gerar Quiz via IA: ${msg}`)
    } finally {
      setLoadingQuiz(false)
    }
  }

  // Loading quiz
  if (loadingQuiz) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-6 p-4 animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
          <Swords className="w-10 h-10 text-orange-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl text-white font-black font-mono mb-2 tracking-tighter uppercase">Formulando o Desafio...</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">A BANCA AOCP ESTÁ ANALISANDO SEU PROGRESSO</p>
        </div>
      </div>
    )
  }

  // Quiz
  if (showQuiz) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-start justify-center p-4 md:p-8 pt-12 animate-fade-in relative overflow-hidden">
        <div className="fixed top-[-10%] right-[-5%] w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-5%] w-80 h-80 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 w-full max-w-4xl">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group font-black uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Abortar Missão
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

  const getSubareaColor = () => {
    if (type === 'Principal') return 'teal'
    if (type === 'Secundaria_Didatica') return 'amber'
    if (type === 'Secundaria_PT') return 'indigo'
    if (type === 'Secundaria_Legis') return 'slate'
    return 'teal'
  }

  const subColor = getSubareaColor()

  const colorClasses: Record<string, {
    text: string,
    bg: string,
    border: string,
    ring: string,
    fill: string,
    prose: string,
    gradient: string,
    shadow: string
  }> = {
    teal: {
      text: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20',
      ring: 'ring-teal-500/20',
      fill: 'fill-teal-400',
      prose: 'prose-teal',
      gradient: 'from-teal-500 to-teal-400',
      shadow: 'shadow-[0_0_12px_rgba(45,212,191,0.5)]'
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      ring: 'ring-amber-500/20',
      fill: 'fill-amber-400',
      prose: 'prose-amber',
      gradient: 'from-amber-500 to-amber-400',
      shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]'
    },
    indigo: {
      text: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      ring: 'ring-indigo-500/20',
      fill: 'fill-indigo-400',
      prose: 'prose-indigo',
      gradient: 'from-indigo-500 to-indigo-400',
      shadow: 'shadow-[0_0_12px_rgba(99,102,241,0.5)]'
    },
    slate: {
      text: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20',
      ring: 'ring-slate-500/20',
      fill: 'fill-slate-400',
      prose: 'prose-slate',
      gradient: 'from-slate-500 to-slate-400',
      shadow: 'shadow-[0_0_12px_rgba(100,116,139,0.5)]'
    }
  }

  const colors = colorClasses[subColor] || colorClasses.teal

  return (
    <div className="min-h-screen bg-[#020617] text-[#f0fdfa] flex flex-col relative overflow-hidden animate-fade-in font-sans selection:bg-teal-500/30">
      {/* Background Decor */}
      <div className={`fixed top-[-10%] right-[-5%] w-[40rem] h-[40rem] ${subColor === 'teal' ? 'bg-teal-500/5' : subColor === 'amber' ? 'bg-amber-500/5' : subColor === 'indigo' ? 'bg-indigo-500/5' : 'bg-slate-500/5'} blur-[120px] rounded-full pointer-events-none z-0`} />
      <div className="fixed bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Reading Progress Header */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1.5 bg-slate-900/50 backdrop-blur-md overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors.gradient} ${colors.shadow}`}
          style={{
            transform: `scaleX(${scrollProgress / 100})`,
            transformOrigin: 'left',
            willChange: 'transform',
          }}
        />
      </div>

      <header className="sticky top-0 h-24 border-b border-white/5 bg-[#020617]/90 backdrop-blur-2xl flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack} 
            className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-95 group shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </button>
          <div className="flex flex-col">
             <div className="flex items-center gap-3">
               <div className={`flex items-center gap-1.5 px-2 py-0.5 ${colors.bg} rounded-md border ${colors.border}`}>
                  <DatabaseZap className={`w-3 h-3 ${colors.text}`} />
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${colors.text}`}>{typeLabel}</span>
               </div>
               {cacheSource && (
                 <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shadow-sm animate-pulse">Cache Ativado</span>
               )}
             </div>
             <h1 className="text-xl md:text-2xl font-black font-mono text-white tracking-tighter leading-none mt-2 drop-shadow-md">
                {topic}
             </h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
           {/* Floating Intel Bar */}
           <div className="flex items-center gap-6 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                 <Clock className="w-4 h-4 text-slate-500" />
                 <span className="text-xs font-black text-slate-300">~{readingTime}m</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                 <BookOpen className="w-4 h-4 text-slate-500" />
                 <span className="text-xs font-black text-slate-300">{wordCount} pal.</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                 <Zap className={`w-4 h-4 ${colors.text} ${colors.fill}`} />
                 <span className="text-xs font-black text-white">+{type === 'Principal' ? 200 : 100} XP</span>
              </div>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-6 pb-32">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Reading Area - Max Expanded */}
          <article className="lg:col-span-10">
             <div className="glass-panel p-8 md:p-14 lg:p-20 rounded-[4rem] border-white/5 bg-[#0a0a0b]/40 relative overflow-hidden shadow-2xl backdrop-blur-3xl min-h-[60vh]">
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${subColor === 'teal' ? 'from-teal-500/50' : subColor === 'amber' ? 'from-amber-500/50' : subColor === 'indigo' ? 'from-indigo-500/50' : 'from-slate-500/50'} to-transparent`} />
                
                {loadingContent ? (
                  <div className="space-y-8 py-10">
                    <LoadingStatus subColor={subColor} />
                    {[100, 90, 95, 80, 100, 70, 85, 92, 88, 75, 90, 65].map((w, i) => (
                      <div
                        key={i}
                        className="h-4 bg-white/5 rounded-full animate-pulse"
                        style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                ) : error ? (
                   <div className="p-8 md:p-14 bg-red-500/5 rounded-[3rem] border border-red-500/10 text-center">
                      <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                         <DatabaseZap className="w-10 h-10 text-red-400" />
                      </div>
                      <h2 className="text-2xl font-black text-white mb-4 uppercase">Erro de Sincronização</h2>
                      <p className="text-slate-400 mb-8 max-w-lg mx-auto font-medium">
                         Não foi possível estabelecer conexão com o motor de inteligência 
                         <strong> {localStorage.getItem('preferred_ai')?.toUpperCase()}</strong>.
                      </p>
                      <div className="p-4 bg-black/40 rounded-2xl mb-10 font-mono text-xs text-red-300 text-left border border-red-500/20 max-w-xl mx-auto overflow-x-auto">
                         CODE: {error}
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                         <button 
                            onClick={onBack}
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 font-black uppercase text-xs tracking-widest transition-all"
                         >
                            Voltar ao Mapa
                         </button>
                         <button 
                            onClick={() => window.location.reload()}
                            className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-red-400 font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-red-950/20"
                         >
                            Tentar Novamente
                         </button>
                      </div>
                      <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                         DICA: Tente trocar o motor de IA nas Configurações se o erro persistir.
                      </p>
                   </div>
                 ) : (
                  <div className={`prose prose-invert ${colors.prose} max-w-none text-slate-200 leading-relaxed text-lg`}>
                     <MarkdownRenderer content={content} />
                  </div>
                )}

                {!loadingContent && (
                   <div className="mt-40 pt-20 border-t border-white/5 flex flex-col items-center text-center relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-emerald-600/5 rounded-[2.5rem] flex items-center justify-center mb-8 ring-4 ring-emerald-500/5 shadow-2xl relative group">
                         <BookOpen className="w-12 h-12 text-emerald-400" />
                      </div>
                      
                      <h3 className="text-4xl font-black text-white mb-4 font-mono uppercase tracking-tighter">Missão Concluída</h3>
                      <p className="text-slate-400 text-lg max-w-lg mb-12 font-medium leading-relaxed">
                         O dossiê técnico foi integrado. O tempo de estudo focado foi respeitado. Você está apto para a validação.
                      </p>
                      
                      {!timerReady ? (
                         <div className="px-10 py-6 bg-orange-500/5 rounded-[2.5rem] border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-4 shadow-lg">
                            <Clock className="w-6 h-6 animate-pulse" />
                            Aguardando Estudo Focado
                         </div>
                      ) : (
                        <div className="px-10 py-6 bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-4">
                           <Trophy className="w-6 h-6" />
                           Pronto para Validação AOCP
                        </div>
                      )}
                   </div>
                )}
             </div>
          </article>

          {/* Sidebar - Ultra Compact */}
          <aside className="lg:col-span-2 space-y-6 lg:sticky lg:top-28">
             <QuestTimer
               questId={questId}
               durationMinutes={durationMinutes}
               onComplete={() => setTimerReady(true)}
             />

             {timerReady && !showQuiz && (
               <button
                 onClick={handleStartQuiz}
                 className="btn-primary w-full h-20 rounded-[2.5rem] flex items-center justify-center gap-4 group relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-100" />
                 <Swords className="w-6 h-6 relative z-10 text-white animate-pulse" />
                 <span className="text-xl font-black uppercase tracking-widest text-white relative z-10">Iniciar Desafio</span>
                 <ArrowLeft className="w-5 h-5 relative z-10 rotate-180 group-hover:translate-x-1 transition-transform text-white" />
               </button>
             )}

             <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 space-y-6 bg-slate-900/40">
                 <div className="space-y-4">
                   <h4 className={`text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2`}>
                      <DatabaseZap className={`w-4 h-4 ${subColor === 'teal' ? 'text-teal-500' : subColor === 'amber' ? 'text-amber-500' : subColor === 'indigo' ? 'text-indigo-500' : 'text-slate-500'}`} />
                      DADOS TÉCNICOS
                   </h4>
                   <div className="grid grid-cols-1 gap-2">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Leitura</span>
                         <span className="text-sm font-black text-white">{readingTime} min</span>
                      </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dificuldade</span>
                          <span className={`text-sm font-black ${colors.text}`}>Avançado</span>
                       </div>
                   </div>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                   <p className="text-[10px] text-slate-500 leading-relaxed italic text-center font-medium">
                      "A consistência gera o impossível."
                   </p>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
